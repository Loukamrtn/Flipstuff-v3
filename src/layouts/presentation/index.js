import React from "react";
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiButton from "../../components/VuiButton";
import { Card } from "@mui/material";
import { FaCrown, FaUserShield, FaBoxes, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../../examples/Footer";

export default function PresentationPage() {
  return (
    <VuiBox minHeight="100vh" bgcolor="#1a0d16" display="flex" flexDirection="column" style={{ color: '#fff', WebkitTextFillColor: '#fff', MozTextFillColor: '#fff' }}>
      {/* Header */}
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" px={4} py={3}>
        <VuiBox display="flex" alignItems="center" gap={2}>
          <img src={require("../../assets/images/logos/Flipstuff.png")} alt="Flipstuff Logo" style={{ height: 40 }} />
          <VuiTypography variant="h4" fontWeight={900} color="#fff" sx={{ letterSpacing: '0.01em' }}>Flipstuff</VuiTypography>
        </VuiBox>
        <VuiBox display="flex" gap={2}>
          <Link to="/authentication/sign-in"><VuiButton variant="outlined" color="primary" sx={{ borderColor: '#ff4fa3', color: '#ff4fa3', fontWeight: 700, borderRadius: 3, background: 'transparent', '&:hover': { background: '#ff4fa322', borderColor: '#ff4fa3', color: '#ff4fa3' } }}>Connexion</VuiButton></Link>
          <Link to="/authentication/sign-up"><VuiButton variant="contained" color="primary" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 700, borderRadius: 3, '&:hover': { background: '#e7125d' } }}>Inscription</VuiButton></Link>
        </VuiBox>
      </VuiBox>
      {/* Hero */}
      <VuiBox flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
        <VuiTypography variant="h1" fontWeight={900} color="#fff" mb={2} sx={{ letterSpacing: '0.01em', fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
          Gérez, partagez et vendez votre stock facilement
        </VuiTypography>
        <VuiTypography variant="h5" color="#fff" mb={4} sx={{ opacity: 1, maxWidth: 600, textAlign: 'center', fontWeight: 500, color: '#fff !important' }}>
          Flipstuff est la plateforme moderne pour gérer vos produits, suivre vos ventes et collaborer en toute simplicité. Essayez gratuitement dès maintenant !
        </VuiTypography>
        <Link to="/authentication/sign-up"><VuiButton variant="contained" color="primary" size="large" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 900, borderRadius: 3, px: 5, py: 2, fontSize: '1.2rem', boxShadow: '0 4px 32px 0 #ff4fa355', '&:hover': { background: '#e7125d' } }}>Commencer</VuiButton></Link>
        {/* Image Dashboard */}
        <img src={require("../../assets/images/logos/Dashboard.png")} alt="Aperçu Dashboard" style={{ marginTop: 48, maxWidth: '90vw', width: 900, borderRadius: 24, boxShadow: '0 8px 48px 0 #ff4fa355' }} />
      </VuiBox>
      {/* Fonctionnalités */}
      <VuiBox display="flex" justifyContent="center" gap={4} flexWrap="wrap" py={6}>
        <Card sx={{
          p: 4,
          minWidth: 260,
          maxWidth: 340,
          bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 32px 0 #ff4fa355',
          border: '2px solid #ff4fa3',
          textAlign: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.04)',
            boxShadow: '0 8px 40px 0 #ff4fa399',
            borderColor: '#ff4fa3',
            background: 'linear-gradient(135deg, #2a1830 60%, #ff4fa322 100%)',
          },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <FaRocket size={48} style={{ color: '#ff4fa3', marginBottom: 18 }} />
          <VuiTypography fontWeight={700} fontSize="1.25rem" mb={1.5} color="#fff">Rapide & Intuitif</VuiTypography>
          <VuiTypography fontSize="1.05rem" color="#fff" opacity={1}>Interface moderne, prise en main immédiate, aucune compétence technique requise.</VuiTypography>
        </Card>
        <Card sx={{
          p: 4,
          minWidth: 260,
          maxWidth: 340,
          bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 32px 0 #bfa2c855',
          border: '2px solid #bfa2c8',
          textAlign: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.04)',
            boxShadow: '0 8px 40px 0 #bfa2c899',
            borderColor: '#bfa2c8',
            background: 'linear-gradient(135deg, #2a1830 60%, #bfa2c822 100%)',
          },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <FaBoxes size={48} style={{ color: '#bfa2c8', marginBottom: 18 }} />
          <VuiTypography fontWeight={700} fontSize="1.25rem" mb={1.5} color="#fff">Gestion de stock</VuiTypography>
          <VuiTypography fontSize="1.05rem" color="#fff" opacity={1}>Ajoutez, suivez et vendez vos produits en quelques clics, tout est centralisé.</VuiTypography>
        </Card>
        <Card sx={{
          p: 4,
          minWidth: 260,
          maxWidth: 340,
          bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 32px 0 #ff4fa355',
          border: '2px solid #ff4fa3',
          textAlign: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.04)',
            boxShadow: '0 8px 40px 0 #ff4fa399',
            borderColor: '#ff4fa3',
            background: 'linear-gradient(135deg, #2a1830 60%, #ff4fa322 100%)',
          },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <FaUserShield size={48} style={{ color: '#ff4fa3', marginBottom: 18 }} />
          <VuiTypography fontWeight={700} fontSize="1.25rem" mb={1.5} color="#fff">Sécurité & confidentialité</VuiTypography>
          <VuiTypography fontSize="1.05rem" color="#fff" opacity={1}>Vos données sont protégées et accessibles uniquement par vous et vos collaborateurs autorisés.</VuiTypography>
        </Card>
      </VuiBox>
      {/* Footer */}
      <Footer />
    </VuiBox>
  );
} 