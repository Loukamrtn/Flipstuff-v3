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
    // On saute la première ligne (header)
    const rows = excelData.slice(1);
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