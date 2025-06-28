/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";
import { TextField, Button, Grid, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Switch, FormControlLabel, ToggleButton, ToggleButtonGroup, Box, Checkbox } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

function Stock() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    taille: "",
    prix_achat: "",
    date_achat: "",
    prix_vente: "",
    date_vente: "",
    plateforme: ""
  });
  const [isSold, setIsSold] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [adding, setAdding] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filter, setFilter] = useState('all');
  const [editDialog, setEditDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteManyDialog, setDeleteManyDialog] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setStocks([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("stock")
        .select("id, nom, taille, prix_achat, date_achat, prix_vente, date_vente, plateforme")
        .eq("user_id", user.id)
        .order("date_achat", { ascending: false });
      if (error) setError(error.message);
      setStocks(data || []);
      setLoading(false);
    };
    fetchStocks();
  }, [user]);

  const columns = [
    { name: "nom", align: "left" },
    { name: "taille", align: "center" },
    { name: "prix_achat", align: "center" },
    { name: "date_achat", align: "center" },
    { name: "prix_vente", align: "center" },
    { name: "date_vente", align: "center" },
    { name: "plateforme", align: "center" },
  ];

  const filteredStocks = (stocks || []).filter(item => {
    if (filter === 'sold') return !!item.prix_vente && !!item.date_vente;
    if (filter === 'stock') return !item.prix_vente && !item.date_vente;
    return true;
  });

  const rows = filteredStocks.map(item => ({
    nom: item.nom,
    taille: item.taille,
    prix_achat: item.prix_achat ? `${item.prix_achat} €` : "-",
    date_achat: item.date_achat ? new Date(item.date_achat).toLocaleDateString() : "-",
    prix_vente: item.prix_vente ? `${item.prix_vente} €` : "-",
    date_vente: item.date_vente ? new Date(item.date_vente).toLocaleDateString() : "-",
    plateforme: item.plateforme || "-",
  }));

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedItems(filteredStocks.map(item => item.id));

  const clearSelection = () => setSelectedItems([]);

  const openDeleteManyDialog = () => setDeleteManyDialog(true);

  const closeDeleteManyDialog = () => setDeleteManyDialog(false);

  const handleDeleteMany = async () => {
    if (selectedItems.length === 0) return;
    await supabase.from("stock").delete().in('id', selectedItems).eq('user_id', user.id);
    setDeleteManyDialog(false);
    setSelectedItems([]);
    // Rafraîchir la liste
    const { data } = await supabase
      .from("stock")
      .select("id, nom, taille, prix_achat, date_achat, prix_vente, date_vente, plateforme")
      .eq("user_id", user.id)
      .order("date_achat", { ascending: false });
    setStocks(data || []);
  };

  const CardGrid = () => (
    <>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
        {filteredStocks.map((item, idx) => {
          const isSold = !!item.prix_vente && !!item.date_vente;
          const checked = selectedItems.includes(item.id);
          return (
            <Card key={item.id || idx} sx={{
              bgcolor: '#24141d',
              borderRadius: 6,
              p: 0,
              boxShadow: '0 8px 32px 0 #00000022',
              color: '#fff',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 240,
              position: 'relative',
              border: checked ? '2px solid #ff4fa3' : 'none',
            }}>
              {/* Header badge + boutons */}
              <Box display="flex" alignItems="center" gap={1.2} px={3} py={2} sx={{
                bgcolor: isSold ? '#ff4fa3' : '#ff8cce',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                minHeight: 48,
                position: 'relative',
                fontWeight: 700,
                color: '#fff',
              }}>
                {isSold ? '✔️' : '📦'}
                <VuiTypography variant="h6" color="#fff" fontWeight={700} fontSize="1.18rem" sx={{ flex: 1 }}>
                  {item.nom}
                </VuiTypography>
                <VuiTypography
                  variant="button"
                  fontWeight={700}
                  sx={{
                    bgcolor: isSold ? '#e7125d' : '#ff4fa3',
                    color: '#fff',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: '0.92rem',
                    letterSpacing: '0.01em',
                    mr: 1.5,
                  }}
                >
                  {isSold ? 'VENDU' : 'EN STOCK'}
                </VuiTypography>
                {/* Boutons modifier/supprimer intégrés dans le header */}
                <Box display="flex" gap={0.5} alignItems="center">
                  <IconButton size="small" onClick={() => openEditDialog(item)} sx={{ color: '#fff', bgcolor: 'transparent', p: 0.7, '&:hover': { bgcolor: isSold ? '#e7125d33' : '#1ed76033', color: '#ff4fa3' } }}>
                    '📝'
                  </IconButton>
                  <IconButton size="small" onClick={() => openDeleteDialog(item)} sx={{ color: '#fff', bgcolor: 'transparent', p: 0.7, '&:hover': { bgcolor: '#ff4fa333', color: '#e7125d' } }}>
                    '🗑️'
                  </IconButton>
                </Box>
              </Box>
              <Box px={3} pb={2} pt={0} display="flex" flexDirection="column" gap={1.2} flex={1}>
                <VuiTypography variant="button" color="text" fontSize="1.05rem">Taille : <b>{item.taille || '-'}</b></VuiTypography>
                <VuiTypography variant="button" color="text" fontSize="1.05rem">
                  Prix achat : <b style={{ color: '#ff4fa3' }}>{item.prix_achat ? `${item.prix_achat} €` : '-'}</b>
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontSize="1.05rem">Date achat : <b>{item.date_achat ? new Date(item.date_achat).toLocaleDateString() : '-'}</b></VuiTypography>
                {isSold && (
                  <>
                    <VuiTypography variant="button" color="text" fontSize="1.05rem">
                      Prix vente : <b style={{ color: '#1ed760' }}>{item.prix_vente} €</b>
                    </VuiTypography>
                    <VuiTypography variant="button" color="text" fontSize="1.05rem">Date vente : <b>{new Date(item.date_vente).toLocaleDateString()}</b></VuiTypography>
                    <VuiTypography variant="button" color="text" fontSize="1.05rem">Plateforme : <b>{item.plateforme}</b></VuiTypography>
                  </>
                )}
              </Box>
              {/* Checkbox de sélection multiple en bas à droite */}
              <Box position="absolute" bottom={16} right={16} zIndex={3}>
                <Checkbox
                  checked={checked}
                  onChange={() => toggleSelectItem(item.id)}
                  icon={<Box sx={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    minHeight: 32,
                    maxWidth: 32,
                    maxHeight: 32,
                    bgcolor: '#ff4fa3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 6px #ff4fa355',
                    overflow: 'visible',
                  }}></Box>}
                  sx={{
                    color: '#ff4fa3!important',
                    bgcolor: 'transparent',
                    borderRadius: '50%',
                    p: 0.5,
                    transition: 'all 0.2s',
                    '& .MuiSvgIcon-root': { color: checked ? '#ff4fa3!important' : '#ff8cce!important' },
                  }}
                  size="medium"
                />
              </Box>
            </Card>
          );
        })}
      </Box>
      {/* Dialog de suppression multiple */}
      <Dialog open={deleteManyDialog} onClose={closeDeleteManyDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#e7125d', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.01em', mb: 2 }}>
          Confirmer la suppression multiple
        </DialogTitle>
        <DialogContent>
          <VuiTypography color="text" textAlign="center">
            Es-tu sûr de vouloir supprimer {selectedItems.length} item(s) du stock ? Cette action est irréversible.
          </VuiTypography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', p: 3 }}>
          <Button onClick={closeDeleteManyDialog} color="secondary">Annuler</Button>
          <Button onClick={handleDeleteMany} variant="contained" color="error" sx={{ color: '#fff', fontWeight: 700 }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSoldSwitch = (e) => {
    setIsSold(e.target.checked);
    if (!e.target.checked) {
      setForm({ ...form, prix_vente: '', date_vente: '', plateforme: '' });
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormError(null);
    setFormSuccess(null);
    setForm({ nom: "", taille: "", prix_achat: "", date_achat: "", prix_vente: "", date_vente: "", plateforme: "" });
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setAdding(true);
    if (!form.nom) {
      setFormError("Le nom est obligatoire.");
      setAdding(false);
      return;
    }
    if (!user) {
      setFormError("Utilisateur non connecté.");
      setAdding(false);
      return;
    }
    const { error } = await supabase.from("stock").insert({
      user_id: user.id,
      nom: form.nom,
      taille: form.taille,
      prix_achat: form.prix_achat ? parseFloat(form.prix_achat) : null,
      date_achat: form.date_achat || null,
      prix_vente: form.prix_vente ? parseFloat(form.prix_vente) : null,
      date_vente: form.date_vente || null,
      plateforme: form.plateforme
    });
    if (error) {
      setFormError(error.message);
    } else {
      setFormSuccess("Item ajouté !");
      setForm({ nom: "", taille: "", prix_achat: "", date_achat: "", prix_vente: "", date_vente: "", plateforme: "" });
      setOpenDialog(false);
      // Rafraîchir la liste
      const { data } = await supabase
        .from("stock")
        .select("id, nom, taille, prix_achat, date_achat, prix_vente, date_vente, plateforme")
        .eq("user_id", user.id)
        .order("date_achat", { ascending: false });
      setStocks(data || []);
    }
    setAdding(false);
  };

  const openEditDialog = (item) => {
    setEditItem(item);
    setEditDialog(true);
  };

  const closeEditDialog = () => {
    setEditDialog(false);
    setEditItem(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setDeleteItem(null);
  };

  const handleEditStock = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setAdding(true);
    if (!editItem.nom) {
      setFormError("Le nom est obligatoire.");
      setAdding(false);
      return;
    }
    if (!user) {
      setFormError("Utilisateur non connecté.");
      setAdding(false);
      return;
    }
    const { error } = await supabase.from("stock").update({
      nom: editItem.nom,
      taille: editItem.taille,
      prix_achat: editItem.prix_achat ? parseFloat(editItem.prix_achat) : null,
      date_achat: editItem.date_achat || null,
      prix_vente: editItem.prix_vente ? parseFloat(editItem.prix_vente) : null,
      date_vente: editItem.date_vente || null,
      plateforme: editItem.plateforme
    }).eq('id', editItem.id).eq('user_id', user.id);
    if (error) {
      setFormError(error.message);
    } else {
      setFormSuccess("Item modifié !");
      setEditDialog(false);
      setEditItem(null);
      // Rafraîchir la liste
      const { data } = await supabase
        .from("stock")
        .select("id, nom, taille, prix_achat, date_achat, prix_vente, date_vente, plateforme")
        .eq("user_id", user.id)
        .order("date_achat", { ascending: false });
      setStocks(data || []);
    }
    setAdding(false);
  };

  const handleDeleteStock = async () => {
    if (!deleteItem) return;
    await supabase.from("stock").delete().eq('id', deleteItem.id).eq('user_id', user.id);
    setDeleteDialog(false);
    setDeleteItem(null);
    // Rafraîchir la liste
    const { data } = await supabase
      .from("stock")
      .select("id, nom, taille, prix_achat, date_achat, prix_vente, date_vente, plateforme")
      .eq("user_id", user.id)
      .order("date_achat", { ascending: false });
    setStocks(data || []);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              sx={{ bgcolor: 'transparent', borderRadius: 3, boxShadow: 'none', gap: 1 }}
            >
              <ToggleButton value="list"
                sx={{
                  color: '#fff',
                  border: 0,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#ff4fa3',
                    color: '#fff',
                    boxShadow: '0 2px 12px 0 #ff4fa355',
                  },
                  '&:hover': { bgcolor: '#ff4fa3', color: '#fff' },
                }}
              >
                📋
              </ToggleButton>
              <ToggleButton value="card"
                sx={{
                  color: '#fff',
                  border: 0,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#ff4fa3',
                    color: '#fff',
                    boxShadow: '0 2px 12px 0 #ff4fa355',
                  },
                  '&:hover': { bgcolor: '#ff4fa3', color: '#fff' },
                }}
              >
                🔲
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} sx={{ ml: 2 }}>
              <ToggleButton value="all"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  border: 0,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '1.05rem',
                  background: 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#ff4fa3 !important',
                    color: '#fff !important',
                    boxShadow: '0 2px 12px 0 #ff4fa355',
                  },
                  '&:hover': { bgcolor: '#ff4fa3', color: '#fff' },
                }}
              >TOUS</ToggleButton>
              <ToggleButton value="stock"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  border: 0,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '1.05rem',
                  background: 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#ff4fa3 !important',
                    color: '#fff !important',
                    boxShadow: '0 2px 12px 0 #ff4fa355',
                  },
                  '&:hover': { bgcolor: '#ff4fa3', color: '#fff' },
                }}
              >EN STOCK</ToggleButton>
              <ToggleButton value="sold"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  border: 0,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '1.05rem',
                  background: 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#ff4fa3 !important',
                    color: '#fff !important',
                    boxShadow: '0 2px 12px 0 #ff4fa355',
                  },
                  '&:hover': { bgcolor: '#ff4fa3', color: '#fff' },
                }}
              >VENDUS</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {selectedItems.length > 0 && (
              <Box display="flex" alignItems="center" gap={2}>
                <VuiTypography sx={{ color: '#ff4fa3!important', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.01em', textShadow: '0 1px 8px #ff4fa355' }}>{selectedItems.length} sélectionné(s)</VuiTypography>
                <Button variant="contained" color="error" onClick={openDeleteManyDialog} sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 700, boxShadow: '0 2px 8px #ff4fa344', '&:hover': { background: '#e7125d' } }}>Supprimer la sélection</Button>
                <Button variant="outlined" color="secondary" onClick={clearSelection} sx={{ color: '#ff4fa3', borderColor: '#ff4fa3', fontWeight: 700, '&:hover': { background: '#ff8cce22', borderColor: '#ff4fa3' } }}>Annuler</Button>
              </Box>
            )}
            <Button variant="contained" color="primary" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 700, borderRadius: 3, px: 3, py: 1, boxShadow: '0 2px 8px #ff4fa344', '&:hover': { background: '#e7125d' } }} onClick={handleOpenDialog}>
              + Ajouter un Item
            </Button>
          </Box>
        </VuiBox>
        <VuiBox mb={3}>
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
            PaperProps={{
              sx: {
                background: '#24141d',
                borderRadius: 4,
                boxShadow: '0 8px 40px 0 #00000080',
                p: 2,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.01em', mb: 2 }}>
              Ajouter un item au stock
            </DialogTitle>
            <DialogContent>
              <form id="add-stock-form" onSubmit={handleAddStock} autoComplete="off">
                <Grid container spacing={2} sx={{
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}>
                  <Grid item xs={12}>
                    <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-nom">
                      Nom *
                    </VuiTypography>
                    <TextField
                      label=""
                      name="nom"
                      id="stock-nom"
                      value={form.nom}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Nom de l'article"
                      InputProps={{
                        style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                        disableUnderline: true,
                      }}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: '#24141d',
                          borderRadius: 3,
                          '& fieldset': { borderColor: '#444', borderWidth: 1 },
                          '&:hover fieldset': { borderColor: '#ff4fa3' },
                          '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                        },
                        'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-taille">
                      Taille
                    </VuiTypography>
                    <TextField
                      label=""
                      name="taille"
                      id="stock-taille"
                      value={form.taille}
                      onChange={handleFormChange}
                      fullWidth
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Ex : 42, M, L..."
                      InputProps={{
                        style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                        disableUnderline: true,
                      }}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: '#24141d',
                          borderRadius: 3,
                          '& fieldset': { borderColor: '#444', borderWidth: 1 },
                          '&:hover fieldset': { borderColor: '#ff4fa3' },
                          '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                        },
                        'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-prix-achat">
                      Prix d'achat (€)
                    </VuiTypography>
                    <TextField
                      label=""
                      name="prix_achat"
                      id="stock-prix-achat"
                      value={form.prix_achat}
                      onChange={handleFormChange}
                      fullWidth
                      type="number"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Ex : 120"
                      InputProps={{
                        style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                        disableUnderline: true,
                      }}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: '#24141d',
                          borderRadius: 3,
                          '& fieldset': { borderColor: '#444', borderWidth: 1 },
                          '&:hover fieldset': { borderColor: '#ff4fa3' },
                          '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                        },
                        'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-date-achat">
                      Date d'achat
                    </VuiTypography>
                    <TextField
                      label=""
                      name="date_achat"
                      id="stock-date-achat"
                      value={form.date_achat}
                      onChange={handleFormChange}
                      fullWidth
                      type="date"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      InputProps={{
                        style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 500, fontSize: '1.08rem', padding: '12px 16px' },
                        disableUnderline: true,
                      }}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: '#24141d',
                          borderRadius: 3,
                          '& fieldset': { borderColor: '#444', borderWidth: 1 },
                          '&:hover fieldset': { borderColor: '#ff4fa3' },
                          '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch checked={isSold} onChange={handleSoldSwitch} sx={{ '& .MuiSwitch-thumb': { backgroundColor: '#ff4fa3' } }} />}
                      label={<VuiTypography sx={{ color: '#fff', fontWeight: 700, ml: 1 }}>Déjà vendu</VuiTypography>}
                      sx={{ ml: 0 }}
                    />
                  </Grid>
                  {isSold && (
                    <>
                      <Grid item xs={12}>
                        <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-prix-vente">
                          Prix de vente (€)
                        </VuiTypography>
                        <TextField
                          label=""
                          name="prix_vente"
                          id="stock-prix-vente"
                          value={form.prix_vente}
                          onChange={handleFormChange}
                          fullWidth
                          type="number"
                          autoComplete="off"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Ex : 180"
                          InputProps={{
                            style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                            disableUnderline: true,
                          }}
                          sx={{
                            mb: 1.5,
                            '& .MuiOutlinedInput-root': {
                              background: '#24141d',
                              borderRadius: 3,
                              '& fieldset': { borderColor: '#444', borderWidth: 1 },
                              '&:hover fieldset': { borderColor: '#ff4fa3' },
                              '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                            },
                            'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-date-vente">
                          Date de vente
                        </VuiTypography>
                        <TextField
                          label=""
                          name="date_vente"
                          id="stock-date-vente"
                          value={form.date_vente}
                          onChange={handleFormChange}
                          fullWidth
                          type="date"
                          autoComplete="off"
                          InputLabelProps={{ shrink: false }}
                          InputProps={{
                            style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 500, fontSize: '1.08rem', padding: '12px 16px' },
                            disableUnderline: true,
                          }}
                          sx={{
                            mb: 1.5,
                            '& .MuiOutlinedInput-root': {
                              background: '#24141d',
                              borderRadius: 3,
                              '& fieldset': { borderColor: '#444', borderWidth: 1 },
                              '&:hover fieldset': { borderColor: '#ff4fa3' },
                              '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-plateforme">
                          Plateforme
                        </VuiTypography>
                        <TextField
                          label=""
                          name="plateforme"
                          id="stock-plateforme"
                          value={form.plateforme}
                          onChange={handleFormChange}
                          fullWidth
                          autoComplete="off"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Ex : Vinted, Leboncoin..."
                          InputProps={{
                            style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                            disableUnderline: true,
                          }}
                          sx={{
                            mb: 1.5,
                            '& .MuiOutlinedInput-root': {
                              background: '#24141d',
                              borderRadius: 3,
                              '& fieldset': { borderColor: '#444', borderWidth: 1 },
                              '&:hover fieldset': { borderColor: '#ff4fa3' },
                              '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                            },
                            'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', p: 3 }}>
              <Button onClick={handleCloseDialog} color="secondary">Annuler</Button>
              <Button type="submit" form="add-stock-form" variant="contained" color="primary" disabled={adding}
                sx={{
                  background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  minWidth: 120,
                  fontSize: '1.08rem',
                  boxShadow: 'none',
                  letterSpacing: '0.04em',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #e7125d 0%, #ff4fa3 100%)',
                  },
                }}
              >
                {adding ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogActions>
          </Dialog>
        </VuiBox>
        <Card>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
            <VuiTypography variant="lg" color="white">
              Stock
            </VuiTypography>
          </VuiBox>
          <VuiBox
            sx={{
              "& th": {
                borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                  `${borderWidth[1]} solid ${grey[700]}`,
              },
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
              },
            }}
          >
            {error && <VuiTypography color="error.main">Erreur : {error}</VuiTypography>}
            {viewMode === 'list' ? (
              <>
                <Table columns={columns} rows={rows} />
                {loading && <VuiTypography color="text" mt={2}>Chargement...</VuiTypography>}
                {!loading && rows.length === 0 && <VuiTypography color="text" mt={2}>Aucun stock trouvé.</VuiTypography>}
              </>
            ) : (
              <>
                <CardGrid />
                {loading && <VuiTypography color="text" mt={2}>Chargement...</VuiTypography>}
                {!loading && filteredStocks.length === 0 && <VuiTypography color="text" mt={2}>Aucun stock trouvé.</VuiTypography>}
              </>
            )}
          </VuiBox>
        </Card>
        {/* Dialog de modification */}
        <Dialog open={editDialog} onClose={closeEditDialog} maxWidth="sm" fullWidth
          PaperProps={{
            sx: {
              background: '#24141d',
              borderRadius: 4,
              boxShadow: '0 8px 40px 0 #00000080',
              p: 2,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.01em', mb: 2 }}>
            Modifier l'item
          </DialogTitle>
          <DialogContent>
            <form id="edit-stock-form" onSubmit={handleEditStock} autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-nom">
                    Nom *
                  </VuiTypography>
                  <TextField
                    label=""
                    name="nom"
                    id="stock-nom"
                    value={editItem?.nom}
                    onChange={(e) => setEditItem({ ...editItem, nom: e.target.value })}
                    fullWidth
                    required
                    autoComplete="off"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Nom de l'article"
                    InputProps={{
                      style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                      disableUnderline: true,
                    }}
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        background: '#24141d',
                        borderRadius: 3,
                        '& fieldset': { borderColor: '#444', borderWidth: 1 },
                        '&:hover fieldset': { borderColor: '#ff4fa3' },
                        '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      },
                      'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-taille">
                    Taille
                  </VuiTypography>
                  <TextField
                    label=""
                    name="taille"
                    id="stock-taille"
                    value={editItem?.taille}
                    onChange={(e) => setEditItem({ ...editItem, taille: e.target.value })}
                    fullWidth
                    autoComplete="off"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Ex : 42, M, L..."
                    InputProps={{
                      style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                      disableUnderline: true,
                    }}
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        background: '#24141d',
                        borderRadius: 3,
                        '& fieldset': { borderColor: '#444', borderWidth: 1 },
                        '&:hover fieldset': { borderColor: '#ff4fa3' },
                        '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      },
                      'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-prix-achat">
                    Prix d'achat (€)
                  </VuiTypography>
                  <TextField
                    label=""
                    name="prix_achat"
                    id="stock-prix-achat"
                    value={editItem?.prix_achat}
                    onChange={(e) => setEditItem({ ...editItem, prix_achat: e.target.value })}
                    fullWidth
                    type="number"
                    autoComplete="off"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Ex : 120"
                    InputProps={{
                      style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                      disableUnderline: true,
                    }}
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        background: '#24141d',
                        borderRadius: 3,
                        '& fieldset': { borderColor: '#444', borderWidth: 1 },
                        '&:hover fieldset': { borderColor: '#ff4fa3' },
                        '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      },
                      'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-date-achat">
                    Date d'achat
                  </VuiTypography>
                  <TextField
                    label=""
                    name="date_achat"
                    id="stock-date-achat"
                    value={editItem?.date_achat}
                    onChange={(e) => setEditItem({ ...editItem, date_achat: e.target.value })}
                    fullWidth
                    type="date"
                    autoComplete="off"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 500, fontSize: '1.08rem', padding: '12px 16px' },
                      disableUnderline: true,
                    }}
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        background: '#24141d',
                        borderRadius: 3,
                        '& fieldset': { borderColor: '#444', borderWidth: 1 },
                        '&:hover fieldset': { borderColor: '#ff4fa3' },
                        '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={editItem?.prix_vente !== null} onChange={(e) => setEditItem({ ...editItem, prix_vente: e.target.checked ? 0 : null })} sx={{ '& .MuiSwitch-thumb': { backgroundColor: '#ff4fa3' } }} />}
                    label={<VuiTypography sx={{ color: '#fff', fontWeight: 700, ml: 1 }}>Déjà vendu</VuiTypography>}
                    sx={{ ml: 0 }}
                  />
                </Grid>
                {editItem?.prix_vente !== null && (
                  <>
                    <Grid item xs={12}>
                      <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-prix-vente">
                        Prix de vente (€)
                      </VuiTypography>
                      <TextField
                        label=""
                        name="prix_vente"
                        id="stock-prix-vente"
                        value={editItem?.prix_vente}
                        onChange={(e) => setEditItem({ ...editItem, prix_vente: e.target.value ? parseFloat(e.target.value) : null })}
                        fullWidth
                        type="number"
                        autoComplete="off"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Ex : 180"
                        InputProps={{
                          style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                          disableUnderline: true,
                        }}
                        sx={{
                          mb: 1.5,
                          '& .MuiOutlinedInput-root': {
                            background: '#24141d',
                            borderRadius: 3,
                            '& fieldset': { borderColor: '#444', borderWidth: 1 },
                            '&:hover fieldset': { borderColor: '#ff4fa3' },
                            '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                          },
                          'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-date-vente">
                        Date de vente
                      </VuiTypography>
                      <TextField
                        label=""
                        name="date_vente"
                        id="stock-date-vente"
                        value={editItem?.date_vente}
                        onChange={(e) => setEditItem({ ...editItem, date_vente: e.target.value })}
                        fullWidth
                        type="date"
                        autoComplete="off"
                        InputLabelProps={{ shrink: false }}
                        InputProps={{
                          style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 500, fontSize: '1.08rem', padding: '12px 16px' },
                          disableUnderline: true,
                        }}
                        sx={{
                          mb: 1.5,
                          '& .MuiOutlinedInput-root': {
                            background: '#24141d',
                            borderRadius: 3,
                            '& fieldset': { borderColor: '#444', borderWidth: 1 },
                            '&:hover fieldset': { borderColor: '#ff4fa3' },
                            '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <VuiTypography sx={{ color: '#fff', fontWeight: 700 }} fontSize="0.98rem" mb={0.5} component="label" htmlFor="stock-plateforme">
                        Plateforme
                      </VuiTypography>
                      <TextField
                        label=""
                        name="plateforme"
                        id="stock-plateforme"
                        value={editItem?.plateforme}
                        onChange={(e) => setEditItem({ ...editItem, plateforme: e.target.value })}
                        fullWidth
                        autoComplete="off"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Ex : Vinted, Leboncoin..."
                        InputProps={{
                          style: { color: '#fff', background: '#24141d', borderRadius: 10, fontWeight: 400, fontSize: '1.08rem', padding: '12px 16px' },
                          disableUnderline: true,
                        }}
                        sx={{
                          mb: 1.5,
                          '& .MuiOutlinedInput-root': {
                            background: '#24141d',
                            borderRadius: 3,
                            '& fieldset': { borderColor: '#444', borderWidth: 1 },
                            '&:hover fieldset': { borderColor: '#ff4fa3' },
                            '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                          },
                          'input::placeholder': { color: '#bfa2c8', opacity: 1 },
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', p: 3 }}>
            <Button onClick={closeEditDialog} color="secondary">Annuler</Button>
            <Button type="submit" form="edit-stock-form" variant="contained" color="primary" disabled={adding}
              sx={{
                background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                minWidth: 120,
                fontSize: '1.08rem',
                boxShadow: 'none',
                letterSpacing: '0.04em',
                '&:hover': {
                  background: 'linear-gradient(90deg, #e7125d 0%, #ff4fa3 100%)',
                },
              }}
            >
              {adding ? "Modification..." : "Modifier"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog de suppression */}
        <Dialog open={deleteDialog} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', color: '#e7125d', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.01em', mb: 2 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <VuiTypography color="text" textAlign="center">
              Es-tu sûr de vouloir supprimer cet item du stock ? Cette action est irréversible.
            </VuiTypography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', p: 3 }}>
            <Button onClick={closeDeleteDialog} color="secondary">Annuler</Button>
            <Button onClick={handleDeleteStock} variant="contained" color="error" sx={{ color: '#fff', fontWeight: 700 }}>Supprimer</Button>
          </DialogActions>
        </Dialog>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Stock;
