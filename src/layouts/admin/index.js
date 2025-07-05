import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import { CircularProgress, Card, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from "@mui/material";
import { FaUser, FaUserShield, FaCrown, FaTrash, FaBoxes } from "react-icons/fa";
import Table from "../../examples/Tables/Table";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, premium: 0, stock: 0 });
  const [editDialog, setEditDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editRang, setEditRang] = useState("");
  const [editError, setEditError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { setIsAdmin(false); setChecking(false); return; }
      // Vérifie le cache local
      const cached = localStorage.getItem('isAdmin_' + user.id);
      if (cached !== null) {
        setIsAdmin(cached === 'true');
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from('profile')
        .select('rang')
        .eq('id', user.id)
        .single();
      const isAdminVal = data?.rang === 'admin';
      setIsAdmin(isAdminVal);
      localStorage.setItem('isAdmin_' + user.id, isAdminVal);
      setChecking(false);
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      // Cache local avec expiration (10 min)
      const now = Date.now();
      const cacheProfiles = localStorage.getItem('admin_profiles');
      const cacheUsers = localStorage.getItem('admin_users');
      const cacheProfilesTime = localStorage.getItem('admin_profiles_time');
      const cacheUsersTime = localStorage.getItem('admin_users_time');
      let profiles, usersData;
      const isProfilesValid = cacheProfiles && cacheProfilesTime && (now - parseInt(cacheProfilesTime) < 10 * 60 * 1000);
      const isUsersValid = cacheUsers && cacheUsersTime && (now - parseInt(cacheUsersTime) < 10 * 60 * 1000);
      if (isProfilesValid && isUsersValid && !actionLoading) {
        profiles = JSON.parse(cacheProfiles);
        usersData = JSON.parse(cacheUsers);
      } else {
        const { data: profilesData } = await supabase.from('profile').select('id, rang');
        profiles = profilesData;
        let usersDataTemp = [];
        if (supabase.rpc) {
          const { data } = await supabase.rpc('get_users');
          usersDataTemp = data || [];
        }
        usersData = usersDataTemp;
        localStorage.setItem('admin_profiles', JSON.stringify(profiles));
        localStorage.setItem('admin_users', JSON.stringify(usersData));
        localStorage.setItem('admin_profiles_time', now.toString());
        localStorage.setItem('admin_users_time', now.toString());
      }
      // Jointure manuelle
      const usersList = (usersData || []).map(u => ({
        ...u,
        rang: (profiles || []).find(p => p.id === u.id)?.rang || 'user',
      }));
      setUsers(usersList);
      // Statistiques
      setStats({
        total: usersList.length,
        admins: usersList.filter(u => u.rang === 'admin').length,
        premium: usersList.filter(u => u.rang === 'premium').length,
        stock: 0, // sera mis à jour après
      });
      // Stock total
      const { count } = await supabase.from('stock').select('id', { count: 'exact', head: true });
      setStats(s => ({ ...s, stock: count || 0 }));
    };
    fetchUsers();
  }, [isAdmin, actionLoading]);

  // Gestion modification rang
  const openEditDialog = (user) => {
    setEditUser(user);
    setEditRang(user.rang);
    setEditError(null);
    setEditDialog(true);
  };
  const closeEditDialog = () => {
    setEditDialog(false);
    setEditUser(null);
    setEditRang("");
    setEditError(null);
  };
  const handleEditRang = async () => {
    setActionLoading(true);
    setEditError(null);
    const { error } = await supabase.from('profile').update({ rang: editRang }).eq('id', editUser.id);
    setActionLoading(false);
    if (error) setEditError(error.message);
    else closeEditDialog();
  };

  // Gestion suppression utilisateur
  const openDeleteDialog = (user) => {
    setDeleteUser(user);
    setDeleteError(null);
    setDeleteDialog(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setDeleteUser(null);
    setDeleteError(null);
  };
  const handleDeleteUser = async () => {
    setActionLoading(true);
    setDeleteError(null);
    // Supprime le profil et l'utilisateur (cascade)
    const { error } = await supabase.from('profile').delete().eq('id', deleteUser.id);
    setActionLoading(false);
    if (error) setDeleteError(error.message);
    else closeDeleteDialog();
  };

  if (loading || checking) {
    return <VuiBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></VuiBox>;
  }
  if (!isAdmin) {
    return (
      <VuiBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <VuiTypography variant="h4" color="error" mb={2}>Accès refusé</VuiTypography>
        <VuiTypography color="text">Tu dois être administrateur pour accéder à cette page.</VuiTypography>
      </VuiBox>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiTypography variant="h2" fontWeight="bold" mb={2} sx={{ color: '#fff !important', textShadow: '0 2px 16px #ff4fa355', letterSpacing: '0.01em' }}>
          Dashboard Administrateur
        </VuiTypography>
        {/* Statistiques globales */}
        <VuiBox display="flex" gap={3} mb={4} flexWrap="wrap">
          <Card sx={{
            p: 3,
            minWidth: 220,
            bgcolor: '#1a0d16',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 4px 32px 0 #ff4fa355',
            border: '1.5px solid #ff4fa3',
            transition: 'transform 0.15s',
            '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px 0 #ff4fa399' },
            position: 'relative',
            overflow: 'visible',
            '::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              boxShadow: '0 0 24px 4px #ff4fa355',
              pointerEvents: 'none',
              zIndex: 0,
            }
          }}>
            <VuiTypography fontWeight={700} fontSize="1.1rem" mb={1} sx={{ color: '#ff4fa3', display: 'flex', alignItems: 'center', gap: 1, textShadow: '0 1px 8px #ff4fa355' }}><FaUser /> Utilisateurs</VuiTypography>
            <VuiTypography fontWeight={900} fontSize="2.2rem" sx={{ textShadow: '0 2px 12px #ff4fa355', color: '#fff' }}>{stats.total}</VuiTypography>
          </Card>
          <Card sx={{
            p: 3,
            minWidth: 220,
            bgcolor: '#1a0d16',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 4px 32px 0 #ff4fa355',
            border: '1.5px solid #ff4fa3',
            transition: 'transform 0.15s',
            '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px 0 #ff4fa399' },
            position: 'relative',
            overflow: 'visible',
            '::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              boxShadow: '0 0 24px 4px #ff4fa355',
              pointerEvents: 'none',
              zIndex: 0,
            }
          }}>
            <VuiTypography fontWeight={700} fontSize="1.1rem" mb={1} sx={{ color: '#ff4fa3', display: 'flex', alignItems: 'center', gap: 1, textShadow: '0 1px 8px #ff4fa355' }}><FaUserShield /> Admins</VuiTypography>
            <VuiTypography fontWeight={900} fontSize="2.2rem" sx={{ textShadow: '0 2px 12px #ff4fa355', color: '#fff' }}>{stats.admins}</VuiTypography>
          </Card>
          <Card sx={{
            p: 3,
            minWidth: 220,
            bgcolor: '#1a0d16',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 4px 32px 0 #1ed76055',
            border: '1.5px solid #1ed760',
            transition: 'transform 0.15s',
            '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px 0 #1ed76099' },
            position: 'relative',
            overflow: 'visible',
            '::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              boxShadow: '0 0 24px 4px #1ed76055',
              pointerEvents: 'none',
              zIndex: 0,
            }
          }}>
            <VuiTypography fontWeight={700} fontSize="1.1rem" mb={1} sx={{ color: '#1ed760', display: 'flex', alignItems: 'center', gap: 1, textShadow: '0 1px 8px #1ed76055' }}><FaCrown /> Premium</VuiTypography>
            <VuiTypography fontWeight={900} fontSize="2.2rem" sx={{ textShadow: '0 2px 12px #1ed76055', color: '#fff' }}>{stats.premium}</VuiTypography>
          </Card>
          <Card sx={{
            p: 3,
            minWidth: 220,
            bgcolor: '#1a0d16',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 4px 32px 0 #bfa2c855',
            border: '1.5px solid #bfa2c8',
            transition: 'transform 0.15s',
            '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px 0 #bfa2c899' },
            position: 'relative',
            overflow: 'visible',
            '::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              boxShadow: '0 0 24px 4px #bfa2c855',
              pointerEvents: 'none',
              zIndex: 0,
            }
          }}>
            <VuiTypography fontWeight={700} fontSize="1.1rem" mb={1} sx={{ color: '#bfa2c8', display: 'flex', alignItems: 'center', gap: 1, textShadow: '0 1px 8px #bfa2c855' }}><FaBoxes /> Stock total</VuiTypography>
            <VuiTypography fontWeight={900} fontSize="2.2rem" sx={{ textShadow: '0 2px 12px #bfa2c855', color: '#fff' }}>{stats.stock}</VuiTypography>
          </Card>
        </VuiBox>
        {/* Gestion des utilisateurs */}
        <Card sx={{ p: 3, borderRadius: 8, bgcolor: '#1a0d16', color: '#fff', boxShadow: '0 4px 32px 0 #ff4fa355', border: '1.5px solid #ff4fa3', mt: 2 }}>
          <VuiTypography variant="h4" color="#fff" fontWeight={700} mb={2} sx={{ textShadow: '0 2px 12px #ff4fa355', letterSpacing: '0.01em' }}>Gestion des utilisateurs</VuiTypography>
          <Table
            columns={[
              { name: "email", align: "left" },
              { name: "rang", align: "center" },
              { name: "created_at", align: "center" },
              { name: "actions", align: "center" },
            ]}
            rows={users.map(u => ({
              id: u.id,
              email: u.email,
              rang: (
                <VuiBox display="flex" alignItems="center" gap={1} justifyContent="center">
                  {u.rang === 'admin' && <FaUserShield style={{ color: '#fff', filter: 'drop-shadow(0 0 2px #fff)' }} />} 
                  {u.rang === 'premium' && <FaCrown style={{ color: '#fff', filter: 'drop-shadow(0 0 2px #fff)' }} />} 
                  {u.rang === 'user' && <FaUser style={{ color: '#fff', filter: 'drop-shadow(0 0 2px #fff)' }} />} 
                  <VuiTypography fontWeight={700} sx={{ color: '#fff !important', fontSize: '1.05rem', letterSpacing: '0.01em', textShadow: '0 1px 8px #fff8' }}>{u.rang.toUpperCase()}</VuiTypography>
                </VuiBox>
              ),
              created_at: <VuiTypography color="#fff">{new Date(u.created_at).toLocaleDateString()}</VuiTypography>,
              actions: (
                <VuiBox display="flex" gap={1} justifyContent="center">
                  <Button variant="outlined" color="primary" size="small" sx={{ borderColor: '#ff4fa3', color: '#ff4fa3', fontWeight: 700, borderRadius: 3, px: 2, fontSize: '1.01rem', letterSpacing: '0.01em', '&:hover': { background: '#ff4fa322', borderColor: '#ff4fa3' } }} onClick={() => openEditDialog(u)}>Modifier</Button>
                  <Button variant="outlined" color="error" size="small" sx={{ borderColor: '#e7125d', color: '#e7125d', fontWeight: 700, borderRadius: 3, px: 2, fontSize: '1.01rem', letterSpacing: '0.01em', '&:hover': { background: '#e7125d22', borderColor: '#e7125d' } }} onClick={() => openDeleteDialog(u)}><FaTrash /></Button>
                </VuiBox>
              ),
            }))}
            selectedItems={[]}
            toggleSelectItem={() => {}}
            selectAll={() => {}}
          />
        </Card>
        {/* Dialog modification rang */}
        <Dialog open={editDialog} onClose={closeEditDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ color: '#ff4fa3', fontWeight: 700, textAlign: 'center', letterSpacing: '0.01em' }}>Modifier le rang</DialogTitle>
          <DialogContent>
            <VuiTypography mb={2}>Email : <b>{editUser?.email}</b></VuiTypography>
            <Select value={editRang} onChange={e => setEditRang(e.target.value)} fullWidth sx={{ mb: 2, bgcolor: '#24141d', color: '#fff', borderRadius: 2 }}>
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </Select>
            {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeEditDialog} color="secondary" sx={{ fontWeight: 700 }}>Annuler</Button>
            <Button onClick={handleEditRang} variant="contained" color="primary" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, '&:hover': { background: '#e7125d' } }} disabled={actionLoading}>Enregistrer</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog suppression utilisateur */}
        <Dialog open={deleteDialog} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ color: '#e7125d', fontWeight: 700, textAlign: 'center', letterSpacing: '0.01em' }}>Supprimer l'utilisateur</DialogTitle>
          <DialogContent>
            <VuiTypography mb={2}>Es-tu sûr de vouloir supprimer <b>{deleteUser?.email}</b> ? Cette action est <b style={{ color: '#e7125d' }}>irréversible</b>.</VuiTypography>
            {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDeleteDialog} color="secondary" sx={{ fontWeight: 700 }}>Annuler</Button>
            <Button onClick={handleDeleteUser} variant="contained" color="error" sx={{ color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, background: '#e7125d', '&:hover': { background: '#ff4fa3' } }} disabled={actionLoading}>Supprimer</Button>
          </DialogActions>
        </Dialog>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
} 