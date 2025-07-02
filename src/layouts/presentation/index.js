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
    <VuiBox minHeight="100vh" bgcolor="#1a0d16" display="flex" flexDirection="column" style={{ color: '#fff', WebkitTextFillColor: '#fff', MozTextFillColor: '#fff', overflowX: 'hidden' }}>
      {/* Header (Top Bar) */}
      <VuiBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={{ xs: 2, md: 4 }}
        py={{ xs: 1.5, md: 2.5 }}
        sx={{ width: '100%', maxWidth: '100vw', background: 'rgba(44, 20, 34, 0.97)', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}
      >
        <VuiBox display="flex" alignItems="center" gap={1.2}>
          <img src={require("../../assets/images/logos/Flipstuff.png")}
            alt="Flipstuff Logo"
            style={{ height: 32, maxWidth: '50vw', width: 'auto', display: 'block' }}
          />
          <VuiTypography variant="h4" fontWeight={900} color="#fff" sx={{ letterSpacing: '0.01em', fontSize: { xs: '1.15rem', md: '1.7rem' } }}>Flipstuff</VuiTypography>
        </VuiBox>
        <VuiBox display="flex" flexDirection="row" gap={1} alignItems="center">
          <Link to="/authentication/sign-in"><VuiButton variant="outlined" color="primary" sx={{ borderColor: '#ff4fa3', color: '#ff4fa3', fontWeight: 700, borderRadius: 3, background: 'transparent', fontSize: { xs: '0.85rem', md: '1.01rem' }, px: { xs: 1.5, md: 2.5 }, py: { xs: 0.5, md: 1 }, minWidth: 0, height: { xs: 30, md: 36 }, '&:hover': { background: '#ff4fa322', borderColor: '#ff4fa3', color: '#ff4fa3' } }}>Connexion</VuiButton></Link>
          <Link to="/authentication/sign-up"><VuiButton variant="contained" color="primary" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 700, borderRadius: 3, fontSize: { xs: '0.85rem', md: '1.01rem' }, px: { xs: 1.5, md: 2.5 }, py: { xs: 0.5, md: 1 }, minWidth: 0, height: { xs: 30, md: 36 }, '&:hover': { background: '#e7125d' } }}>Inscription</VuiButton></Link>
        </VuiBox>
      </VuiBox>
      {/* Hero */}
      <VuiBox flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={{ xs: 3, md: 8 }} px={{ xs: 2, md: 0 }}>
        <VuiTypography variant="h1" fontWeight={900} color="#fff" mb={2} sx={{ letterSpacing: '0.01em', fontSize: { xs: '1.25rem', sm: '1.7rem', md: '3.5rem' }, textAlign: 'center', maxWidth: { xs: '90vw', md: 700 }, mx: 'auto', mb: { xs: 2, md: 3 } }}>
          Gérez, partagez et vendez votre stock facilement
        </VuiTypography>
        <VuiTypography variant="h5" color="#fff" mb={4} sx={{ opacity: 1, maxWidth: { xs: '90vw', md: 600 }, textAlign: 'center', fontWeight: 500, color: '#fff !important', fontSize: { xs: '0.98rem', md: '1.25rem' }, mx: 'auto', mb: { xs: 2.5, md: 4 } }}>
          Flipstuff est la plateforme moderne pour gérer vos produits, suivre vos ventes et collaborer en toute simplicité. Essayez gratuitement dès maintenant !
        </VuiTypography>
        <Link to="/authentication/sign-up" style={{ width: '100%', maxWidth: 340, margin: '0 auto' }}><VuiButton variant="contained" color="primary" size="large" sx={{ background: '#ff4fa3', color: '#fff', fontWeight: 900, borderRadius: 3, px: { xs: 0, md: 5 }, py: { xs: 1.5, md: 2 }, fontSize: { xs: '1.05rem', md: '1.2rem' }, boxShadow: '0 4px 32px 0 #ff4fa355', width: '100%', mb: { xs: 2.5, md: 4 }, '&:hover': { background: '#e7125d' } }}>Commencer</VuiButton></Link>
        {/* Image Dashboard */}
        <img src={require("../../assets/images/logos/Dashboard.png")}
          alt="Aperçu Dashboard"
          style={{ marginTop: 24, marginBottom: 24, width: '100%', maxWidth: 900, maxHeight: 340, borderRadius: 12, boxShadow: '0 8px 48px 0 #ff4fa355', objectFit: 'contain', display: 'block', marginLeft: 'auto', marginRight: 'auto', background: '#1a0d16' }}
        />
      </VuiBox>
      {/* Fonctionnalités */}
      <VuiBox px={{ xs: 2, md: 0 }}>
        <VuiTypography variant="h3" fontWeight={800} color="#ff4fa3" mb={3} sx={{ textAlign: 'center', fontSize: { xs: '1.18rem', md: '1.7rem' }, letterSpacing: '0.01em', mt: { xs: 1, md: 2 } }}>
          Pourquoi Flipstuff&nbsp;?
        </VuiTypography>
        <VuiBox display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="center" alignItems="center" gap={4} flexWrap="wrap" py={{ xs: 1, md: 6 }}>
          <Card sx={{
            p: { xs: 2, md: 4 },
            width: '100%',
            maxWidth: 340,
            bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
            color: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px 0 #ff4fa355',
            border: '2px solid #ff4fa3',
            textAlign: 'center',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            margin: '0 auto',
            mb: { xs: 3, md: 0 },
            '&:hover': {
              transform: 'translateY(-8px) scale(1.04)',
              boxShadow: '0 8px 40px 0 #ff4fa399',
              borderColor: '#ff4fa3',
              background: 'linear-gradient(135deg, #2a1830 60%, #ff4fa322 100%)',
            },
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <FaRocket size={40} style={{ color: '#ff4fa3', marginBottom: 12 }} />
            <VuiTypography fontWeight={700} fontSize={{ xs: '1.08rem', md: '1.25rem' }} mb={1.5} color="#fff">Rapide & Intuitif</VuiTypography>
            <VuiTypography fontSize={{ xs: '0.95rem', md: '1.05rem' }} color="#fff" opacity={1}>Interface moderne, prise en main immédiate, aucune compétence technique requise.</VuiTypography>
          </Card>
          <Card sx={{
            p: { xs: 2, md: 4 },
            width: '100%',
            maxWidth: 340,
            bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
            color: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px 0 #bfa2c855',
            border: '2px solid #bfa2c8',
            textAlign: 'center',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            margin: '0 auto',
            mb: { xs: 3, md: 0 },
            '&:hover': {
              transform: 'translateY(-8px) scale(1.04)',
              boxShadow: '0 8px 40px 0 #bfa2c899',
              borderColor: '#bfa2c8',
              background: 'linear-gradient(135deg, #2a1830 60%, #bfa2c822 100%)',
            },
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <FaBoxes size={40} style={{ color: '#bfa2c8', marginBottom: 12 }} />
            <VuiTypography fontWeight={700} fontSize={{ xs: '1.08rem', md: '1.25rem' }} mb={1.5} color="#fff">Gestion de stock</VuiTypography>
            <VuiTypography fontSize={{ xs: '0.95rem', md: '1.05rem' }} color="#fff" opacity={1}>Ajoutez, suivez et vendez vos produits en quelques clics, tout est centralisé.</VuiTypography>
          </Card>
          <Card sx={{
            p: { xs: 2, md: 4 },
            width: '100%',
            maxWidth: 340,
            bgcolor: 'linear-gradient(135deg, #24141d 60%, #2a1830 100%)',
            color: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px 0 #ff4fa355',
            border: '2px solid #ff4fa3',
            textAlign: 'center',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            margin: '0 auto',
            mb: { xs: 3, md: 0 },
            '&:hover': {
              transform: 'translateY(-8px) scale(1.04)',
              boxShadow: '0 8px 40px 0 #ff4fa399',
              borderColor: '#ff4fa3',
              background: 'linear-gradient(135deg, #2a1830 60%, #ff4fa322 100%)',
            },
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <FaUserShield size={40} style={{ color: '#ff4fa3', marginBottom: 12 }} />
            <VuiTypography fontWeight={700} fontSize={{ xs: '1.08rem', md: '1.25rem' }} mb={1.5} color="#fff">Sécurité & confidentialité</VuiTypography>
            <VuiTypography fontSize={{ xs: '0.95rem', md: '1.05rem' }} color="#fff" opacity={1}>Vos données sont protégées et accessibles uniquement par vous et vos collaborateurs autorisés.</VuiTypography>
          </Card>
        </VuiBox>
      </VuiBox>
      {/* Footer */}
      <Footer />
    </VuiBox>
  );
} 