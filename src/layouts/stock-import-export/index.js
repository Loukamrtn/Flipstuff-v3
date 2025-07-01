import React, { useRef, useState, useEffect } from "react";
import VuiBox from "components/VuiBox";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import Card from "@mui/material/Card";
import * as XLSX from "xlsx";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Footer from "examples/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const REQUIRED_FIELDS = [
  { key: "nom", label: "Nom" },
  { key: "taille", label: "Taille" },
  { key: "prixAchat", label: "Prix achat" },
  { key: "dateAchat", label: "Date achat" },
  { key: "prixVente", label: "Prix vente" },
  { key: "dateVente", label: "Date vente" },
  { key: "plateforme", label: "Plateforme" },
];

// Conversion date Excel -> ISO
function excelDateToISO(excelDate) {
  if (!excelDate) return null;
  // Si déjà une date ISO (YYYY-MM-DD)
  if (typeof excelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(excelDate)) return excelDate;
  // Si format français DD/MM/YYYY
  if (typeof excelDate === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(excelDate)) {
    const [d, m, y] = excelDate.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Si nombre Excel
  if (!isNaN(excelDate)) {
    const jsDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return jsDate.toISOString().split('T')[0];
  }
  return null;
}

export default function StockImportExport() {
  const fileInputRef = useRef();
  const [excelColumns, setExcelColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [showMappingForm, setShowMappingForm] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const { user } = useAuth();

  const handleImportClick = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        setImportStatus({ type: 'error', msg: "Seuls les fichiers Excel (.xlsx, .xls) sont acceptés." });
        return;
      }
      // Limite de taille (2 Mo)
      if (file.size > 2 * 1024 * 1024) {
        setImportStatus({ type: 'error', msg: "Le fichier est trop volumineux (max 2 Mo)." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        if (jsonData.length > 0) {
          setExcelColumns(jsonData[0]);
          setExcelData(jsonData);
          setShowMappingForm(true);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleMappingChange = (field, value) => {
    setMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleMappingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setImportStatus({ type: 'error', msg: "Vous devez être connecté pour importer." });
      return;
    }
    // Limite de 500 items par import
    const rows = excelData.slice(1);
    if (rows.length > 500) {
      setImportStatus({ type: 'error', msg: "Limite de 500 items par import dépassée. Merci de diviser votre fichier." });
      return;
    }
    // Confirmation si plus de 100 items
    if (rows.length > 100 && !window.confirm(`Attention : tu t'apprêtes à importer ${rows.length} items. Confirme-tu ?`)) {
      setImportStatus({ type: 'error', msg: "Import annulé par l'utilisateur." });
      return;
    }
    // Détection de doublons (nom+date_achat)
    const seen = new Set();
    for (const row of rows) {
      const nom = row[excelColumns.indexOf(mapping.nom)] || '';
      let date_achat = row[excelColumns.indexOf(mapping.dateAchat)] || '';
      date_achat = excelDateToISO(date_achat) || '';
      if (!nom) continue;
      const key = nom.trim().toLowerCase() + '|' + date_achat;
      if (seen.has(key)) {
        setImportStatus({ type: 'error', msg: `Doublon détecté dans le fichier : ${nom} (${date_achat})` });
        return;
      }
      seen.add(key);
    }
    // Vérification stricte des champs
    for (const row of rows) {
      const nom = row[excelColumns.indexOf(mapping.nom)] || '';
      if (!nom || nom.length > 30) {
        setImportStatus({ type: 'error', msg: `Nom manquant ou trop long (max 30 caractères) sur une ligne.` });
        return;
      }
      const taille = row[excelColumns.indexOf(mapping.taille)] || '';
      if (taille && taille.length > 10) {
        setImportStatus({ type: 'error', msg: `Taille trop longue (max 10 caractères) sur une ligne.` });
        return;
      }
      const prix_achat = row[excelColumns.indexOf(mapping.prixAchat)] || '';
      if (prix_achat && (isNaN(prix_achat) || parseFloat(prix_achat) > 99999.99)) {
        setImportStatus({ type: 'error', msg: `Prix achat invalide ou trop élevé (max 99999.99) sur une ligne.` });
        return;
      }
      const prix_vente = row[excelColumns.indexOf(mapping.prixVente)] || '';
      if (prix_vente && (isNaN(prix_vente) || parseFloat(prix_vente) > 99999.99)) {
        setImportStatus({ type: 'error', msg: `Prix vente invalide ou trop élevé (max 99999.99) sur une ligne.` });
        return;
      }
      // Vérification des dates
      let date_achat = row[excelColumns.indexOf(mapping.dateAchat)] || '';
      let date_vente = row[excelColumns.indexOf(mapping.dateVente)] || '';
      date_achat = excelDateToISO(date_achat);
      date_vente = excelDateToISO(date_vente);
      const minDate = new Date('2000-01-01');
      const now = new Date();
      if (date_achat) {
        const d = new Date(date_achat);
        if (d < minDate || d > now) {
          setImportStatus({ type: 'error', msg: `Date d'achat invalide (doit être entre 2000 et aujourd'hui) sur une ligne.` });
          return;
        }
      }
      if (date_vente) {
        const d = new Date(date_vente);
        if (d < minDate || d > now) {
          setImportStatus({ type: 'error', msg: `Date de vente invalide (doit être entre 2000 et aujourd'hui) sur une ligne.` });
          return;
        }
        if (date_achat && new Date(date_vente) < new Date(date_achat)) {
          setImportStatus({ type: 'error', msg: `Date de vente antérieure à la date d'achat sur une ligne.` });
          return;
        }
      }
    }
    // Vérifie le délai de 10 minutes entre chaque import Excel
    const lastImport = localStorage.getItem(`lastImportExcel_${user.id}`);
    const now = Date.now();
    if (lastImport && now - parseInt(lastImport) < 600000) {
      setImportStatus({ type: 'error', msg: "Pour des raisons de sécurité, l'import Excel est limité : merci d'attendre 10 minutes entre chaque import." });
      return;
    }
    // Vérifie le délai d'une minute entre chaque ajout d'item (manuel ou import)
    const lastAdd = localStorage.getItem(`lastAddItem_${user.id}`);
    if (lastAdd && now - parseInt(lastAdd) < 60000) {
      setImportStatus({ type: 'error', msg: "Pour des raisons de sécurité, l'ajout d'item est limité : merci d'attendre 1 minute entre chaque ajout (import ou manuel)." });
      return;
    }
    localStorage.setItem(`lastAddItem_${user.id}`, now.toString());
    localStorage.setItem(`lastImportExcel_${user.id}`, now.toString());
    // On saute la première ligne (header)
    let successCount = 0;
    let errorCount = 0;
    let errorMessages = [];
    for (const row of rows) {
      // On récupère la valeur de chaque champ selon le mapping
      const nom = row[excelColumns.indexOf(mapping.nom)] || '';
      const taille = row[excelColumns.indexOf(mapping.taille)] || '';
      const prix_achat = row[excelColumns.indexOf(mapping.prixAchat)] || '';
      let date_achat = row[excelColumns.indexOf(mapping.dateAchat)] || '';
      const prix_vente = row[excelColumns.indexOf(mapping.prixVente)] || '';
      let date_vente = row[excelColumns.indexOf(mapping.dateVente)] || '';
      const plateforme = row[excelColumns.indexOf(mapping.plateforme)] || '';
      // Conversion des dates
      date_achat = excelDateToISO(date_achat);
      date_vente = excelDateToISO(date_vente);
      if (!nom) continue; // On saute les lignes sans nom
      const item = {
        user_id: user.id,
        nom,
        taille,
        prix_achat: prix_achat ? parseFloat(prix_achat) : null,
        date_achat: date_achat || null,
        prix_vente: prix_vente ? parseFloat(prix_vente) : null,
        date_vente: date_vente || null,
        plateforme
      };
      console.log('Insertion item:', item);
      const { error } = await supabase.from('stock').insert(item);
      if (error) {
        if (error.message && error.message.includes('limite')) {
          setImportStatus({ type: 'error', msg: "Vous avez dépassé la limite d'import. Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        } else if (error.message && error.message.includes('délai')) {
          setImportStatus({ type: 'error', msg: "Vous devez attendre avant de pouvoir ajouter/importer à nouveau. Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        } else if (error.message && error.message.includes('row-level security policy')) {
          setImportStatus({ type: 'error', msg: "Action non autorisée. Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        } else if (error.message && error.message.includes('violates unique constraint')) {
          setImportStatus({ type: 'error', msg: "Un doublon a été détecté. Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        } else if (error.message && error.message.includes('value too long')) {
          setImportStatus({ type: 'error', msg: "Une des informations saisies est trop longue. Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        } else {
          setImportStatus({ type: 'error', msg: (error.message || "Erreur inconnue lors de l'import/export.") + " Si vous pensez qu'il s'agit d'une erreur, contactez le support." });
        }
        errorCount++;
        errorMessages.push(error.message);
      }
      else successCount++;
    }
    setImportStatus({ type: errorCount > 0 ? 'error' : 'success', msg: `${successCount} item(s) importé(s) avec succès. ${errorCount > 0 ? errorCount + ' erreur(s) : ' + errorMessages.join(' | ') : ''}` });
    setShowMappingForm(false);
  };

  const handleExport = () => {
    // Ici, tu pourras ajouter la logique d'export (génération et téléchargement d'un CSV)
    alert('Export du stock en CSV (fonctionnalité à implémenter)');
  };

  useEffect(() => {
    if (importStatus && importStatus.type === 'success') {
      const timer = setTimeout(() => setImportStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [importStatus]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
        <VuiTypography variant="h3" color="info" fontWeight="bold" mb={4}>
          Importer / Exporter le stock
        </VuiTypography>
        <VuiBox display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="center" alignItems="stretch" width="100%" maxWidth={900} gap={4}>
          {/* Carte Import */}
          <Card sx={{ flex: 1, bgcolor: "rgba(44, 20, 34, 0.85)", borderRadius: 3, boxShadow: '0 8px 32px 0 #ff4fa340', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Message de succès global */}
            {importStatus && importStatus.type === 'success' && (
              <VuiBox position="absolute" top={12} left={0} width="100%" zIndex={10} display="flex" justifyContent="center">
                <VuiTypography color="success.main" fontWeight="bold" bgcolor="#e6fff2" borderRadius={2} px={3} py={1} boxShadow="0 2px 8px #1ed76022">
                  {importStatus.msg}
                </VuiTypography>
              </VuiBox>
            )}
            <VuiTypography variant="h5" color="info" fontWeight="bold" mb={2}>
              Importer le stock
            </VuiTypography>
            <VuiTypography variant="body2" color="text" textAlign="center" mb={3}>
              Sélectionne un fichier Excel (.xlsx, .xls) pour mettre à jour ton stock.<br/>Le format peut être personnalisé grâce au formulaire de correspondance.
            </VuiTypography>
            <VuiButton color="info" variant="contained" startIcon={<FaFileImport />} onClick={handleImportClick}>
              Importer Excel
            </VuiButton>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {showMappingForm && (
              <VuiBox mt={4} width="100%">
                <VuiTypography variant="h6" color="info" fontWeight="bold" mb={2}>
                  Associe les colonnes de ton fichier aux champs requis :
                </VuiTypography>
                {/* Aperçu des colonnes détectées */}
                <VuiBox mb={2} p={2} bgcolor="#2d1a2b" borderRadius={2}>
                  <VuiTypography variant="body2" color="white" fontWeight="bold" mb={1}>
                    Colonnes détectées :
                  </VuiTypography>
                  <VuiTypography variant="body2" color="white">
                    {excelColumns.join(' | ')}
                  </VuiTypography>
                </VuiBox>
                <form onSubmit={handleMappingSubmit}>
                  {REQUIRED_FIELDS.map((field) => (
                    <VuiBox key={field.key} mb={2}>
                      <VuiTypography variant="body2" color="info" fontWeight="bold" mb={0.5}>
                        {field.label + " (choisir une colonne)"}
                      </VuiTypography>
                      <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: 2, p: 1.5 }} variant="outlined">
                        <Select
                          value={mapping[field.key] || ""}
                          onChange={(e) => handleMappingChange(field.key, e.target.value)}
                          required
                          displayEmpty
                          fullWidth
                          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                        >
                          <MenuItem value="" disabled>
                            <em>Sélectionner...</em>
                          </MenuItem>
                          {excelColumns.map((col, idx) => (
                            <MenuItem value={col} key={idx}>{col}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </VuiBox>
                  ))}
                  <VuiButton color="info" variant="contained" type="submit" fullWidth>
                    Valider le mapping
                  </VuiButton>
                </form>
              </VuiBox>
            )}
          </Card>
          {/* Carte Export */}
          <Card sx={{ flex: 1, bgcolor: "rgba(44, 20, 34, 0.85)", borderRadius: 3, boxShadow: '0 8px 32px 0 #ff4fa340', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VuiTypography variant="h5" color="info" fontWeight="bold" mb={2}>
              Exporter le stock
            </VuiTypography>
            <VuiTypography variant="body2" color="text" textAlign="center" mb={3}>
              Télécharge un fichier CSV contenant l'état actuel de ton stock.<br/>Idéal pour sauvegarder ou utiliser dans d'autres outils.
            </VuiTypography>
            <VuiButton color="info" variant="outlined" startIcon={<FaFileExport />} onClick={handleExport}>
              Exporter CSV
            </VuiButton>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
} 