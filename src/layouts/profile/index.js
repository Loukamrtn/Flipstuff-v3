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
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import team1 from "assets/images/avatar1.png";
import team2 from "assets/images/avatar2.png";
import team3 from "assets/images/avatar3.png";
import team4 from "assets/images/avatar4.png";
// Images
import profile1 from "assets/images/profile-1.png";
import profile2 from "assets/images/profile-2.png";
import profile3 from "assets/images/profile-3.png";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from "examples/Footer";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import Welcome from "../profile/components/Welcome/index";
import CarInformations from "./components/CarInformations";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { Avatar, Button, Typography, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton, InputAdornment, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const providerLabel = {
  google: "Google",
  discord: "Discord",
  email: "Email"
};

export default function Profile() {
  const { user, loading } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.user_metadata?.displayName || user?.user_metadata?.full_name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password2: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (loading) {
    return <VuiBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></VuiBox>;
  }

  if (!user) {
    return (
      <VuiBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <VuiTypography variant="h4" color="white" mb={2}>Non connecté</VuiTypography>
        <Button variant="contained" color="primary" href="/authentication/sign-in">Se connecter</Button>
      </VuiBox>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url ||
    (user.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.displayName || user.email)}` : undefined);
  const displayName = user.user_metadata?.displayName || user.user_metadata?.full_name || user.email;
  const provider = user.app_metadata?.provider || (user.identities && user.identities[0]?.provider) || "email";
  const createdAt = user.created_at && !isNaN(new Date(user.created_at)) ? new Date(user.created_at) : null;

  const handleLogout = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/authentication/sign-in";
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      if (form.displayName && form.displayName !== (user.user_metadata?.displayName || user.user_metadata?.full_name)) {
        const { error } = await supabase.auth.updateUser({ data: { displayName: form.displayName } });
        if (error) throw error;
      }
      if (form.email && form.email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: form.email });
        if (error) throw error;
      }
      setFeedback({ type: "success", msg: "Profil mis à jour !" });
    } catch (e) {
      setFeedback({ type: "error", msg: e.message });
    }
    setSaving(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordFeedback(null);
    try {
      if (!passwordForm.password) throw new Error("Le mot de passe ne peut pas être vide.");
      if (passwordForm.password !== passwordForm.password2) throw new Error("Les mots de passe ne correspondent pas.");
      if (passwordForm.password.length < 6) throw new Error("Le mot de passe doit faire au moins 6 caractères.");
      const { error } = await supabase.auth.updateUser({ password: passwordForm.password });
      if (error) throw error;
      setPasswordFeedback({ type: "success", msg: "Mot de passe modifié !" });
      setPasswordForm({ password: '', password2: '' });
    } catch (e) {
      setPasswordFeedback({ type: "error", msg: e.message });
    }
    setSavingPassword(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={4} justifyContent="center">
          {/* Section Profil Utilisateur */}
          <Grid item xs={12} md={5}>
            <Card sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: '0 4px 32px 0 #0000001a',
              bgcolor: 'background.card',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}>
              <Avatar src={avatarUrl} alt={displayName} sx={{ width: 100, height: 100, mb: 2, bgcolor: '#ff4fa3', color: '#fff', fontSize: 40, border: '4px solid #ff4fa3' }} />
              <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1} sx={{ letterSpacing: '0.01em' }}>{displayName}</VuiTypography>
              <VuiTypography variant="button" color="text" mb={1}>{user.email}</VuiTypography>
              <Divider sx={{ width: '100%', my: 2, bgcolor: '#ff4fa355' }} />
              <VuiTypography variant="button" color="text">ID utilisateur : <b>{user.id}</b></VuiTypography>
              <VuiTypography variant="button" color="text">Provider : <b>{providerLabel[provider] || provider}</b></VuiTypography>
              {createdAt && (
                <VuiTypography variant="button" color="text">Inscrit le : {createdAt.toLocaleDateString()}</VuiTypography>
              )}
            </Card>
            {/* Section Sécurité */}
            <Card sx={{
              p: 3,
              borderRadius: 5,
              boxShadow: '0 4px 32px 0 #0000001a',
              bgcolor: 'background.card',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 3
            }}>
              <VuiTypography variant="h6" color="white" fontWeight="bold" mb={1}>Sécurité</VuiTypography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                disabled={logoutLoading}
                sx={{
                  background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  mt: 1,
                  boxShadow: 'none',
                  letterSpacing: '0.04em',
                  fontSize: '1.08rem',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #e7125d 0%, #ff4fa3 100%)',
                  },
                }}
              >
                {logoutLoading ? <CircularProgress size={22} color="inherit" /> : 'Se déconnecter'}
              </Button>
            </Card>
          </Grid>
          {/* Section Modification Profil */}
          <Grid item xs={12} md={7}>
            <Card sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: '0 4px 32px 0 #0000001a',
              bgcolor: 'background.card',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
              <VuiTypography variant="h5" color="white" fontWeight="bold" mb={2}>
                Modifier le profil
              </VuiTypography>
              <form onSubmit={handleSave} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
                {feedback && <Alert severity={feedback.type} sx={{ width: '100%' }}>{feedback.msg}</Alert>}
                <TextField
                  label="Pseudo"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleFormChange}
                  fullWidth
                  autoFocus
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 600 }, shrink: true }}
                  placeholder="Pseudo"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: '#2a1833',
                      borderRadius: 3,
                      '& input': {
                        background: 'transparent',
                        color: '#fff',
                        padding: '14px 16px',
                        fontWeight: 500,
                        fontSize: '1.08rem',
                      },
                      '& fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2.5 },
                    },
                    '& .MuiInputLabel-root': { color: '#fff', fontWeight: 600 },
                    'input::placeholder': { color: '#ffb6e6', opacity: 1, fontWeight: 400 },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  fullWidth
                  type="email"
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 600 }, shrink: true }}
                  placeholder="Email"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: '#2a1833',
                      borderRadius: 3,
                      '& input': {
                        background: 'transparent',
                        color: '#fff',
                        padding: '14px 16px',
                        fontWeight: 500,
                        fontSize: '1.08rem',
                      },
                      '& fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2.5 },
                    },
                    '& .MuiInputLabel-root': { color: '#fff', fontWeight: 600 },
                    'input::placeholder': { color: '#ffb6e6', opacity: 1, fontWeight: 400 },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    py: 1.2,
                    mt: 2,
                    boxShadow: 'none',
                    letterSpacing: '0.04em',
                    fontSize: '1.08rem',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e7125d 0%, #ff4fa3 100%)',
                    },
                  }}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Enregistrer'}
                </Button>
              </form>
            </Card>
            {/* Section Modification Mot de Passe */}
            <Card sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: '0 4px 32px 0 #0000001a',
              bgcolor: 'background.card',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}>
              <VuiTypography variant="h5" color="white" fontWeight="bold" mb={2}>
                Modifier le mot de passe
              </VuiTypography>
              <form onSubmit={handleSavePassword} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
                {passwordFeedback && <Alert severity={passwordFeedback.type} sx={{ width: '100%' }}>{passwordFeedback.msg}</Alert>}
                <TextField
                  label="Nouveau mot de passe"
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordFormChange}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 600 }, shrink: true }}
                  placeholder="Nouveau mot de passe"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: '#2a1833',
                      borderRadius: 3,
                      '& input': {
                        background: 'transparent',
                        color: '#fff',
                        padding: '14px 16px',
                        fontWeight: 500,
                        fontSize: '1.08rem',
                      },
                      '& fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2.5 },
                    },
                    '& .MuiInputLabel-root': { color: '#fff', fontWeight: 600 },
                    'input::placeholder': { color: '#ffb6e6', opacity: 1, fontWeight: 400 },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small" sx={{ color: '#ff4fa3' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Confirmer le mot de passe"
                  name="password2"
                  value={passwordForm.password2}
                  onChange={handlePasswordFormChange}
                  type={showPassword2 ? "text" : "password"}
                  fullWidth
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 600 }, shrink: true }}
                  placeholder="Confirmer le mot de passe"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: '#2a1833',
                      borderRadius: 3,
                      '& input': {
                        background: 'transparent',
                        color: '#fff',
                        padding: '14px 16px',
                        fontWeight: 500,
                        fontSize: '1.08rem',
                      },
                      '& fieldset': { borderColor: '#ff4fa3', borderWidth: 2 },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#ff4fa3', borderWidth: 2.5 },
                    },
                    '& .MuiInputLabel-root': { color: '#fff', fontWeight: 600 },
                    'input::placeholder': { color: '#ffb6e6', opacity: 1, fontWeight: 400 },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword2(v => !v)} edge="end" size="small" sx={{ color: '#ff4fa3' }}>
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={savingPassword}
                  sx={{
                    background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    py: 1.2,
                    mt: 2,
                    boxShadow: 'none',
                    letterSpacing: '0.04em',
                    fontSize: '1.08rem',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #e7125d 0%, #ff4fa3 100%)',
                    },
                  }}
                >
                  {savingPassword ? <CircularProgress size={20} color="inherit" /> : 'Changer le mot de passe'}
                </Button>
              </form>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
    </DashboardLayout>
  );
}
