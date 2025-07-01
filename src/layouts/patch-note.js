import React, { useEffect, useState } from "react";
import Footer from "../examples/Footer";
import VuiBox from "../components/VuiBox";
import VuiTypography from "../components/VuiTypography";
import { Card } from "@mui/material";
import { Link } from "react-router-dom";
import logoFlipstuff from "../assets/images/logos/Flipstuff.png";

function GithubPatchNotes() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/Loukamrtn/Flipstuff-v3/commits?per_page=10")
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des commits");
        return res.json();
      })
      .then(data => {
        setCommits(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const dateLimite = new Date('2025-07-01T00:00:00Z');
  const commitsFiltres = commits.filter(commit => new Date(commit.commit.author.date) > dateLimite);

  if (loading) return <VuiTypography color="#fff" my={2}>Chargement des mises à jour GitHub…</VuiTypography>;
  if (error) return <VuiTypography color="error" my={2}>{error}</VuiTypography>;
  if (commitsFiltres.length === 0) return null;

  return (
    <VuiBox mt={4}>
      <VuiTypography variant="h4" fontWeight={700} mb={2} sx={{ color: '#ff4fa3', textAlign: 'center', textShadow: '0 1px 8px #ff4fa355' }}>
        Historique GitHub (commits après le 1er juillet 2025)
      </VuiTypography>
      <VuiBox component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {commitsFiltres.length === 0 && (
          <VuiTypography color="#fff" my={2} textAlign="center">Aucun commit après le 1er juillet 2025.</VuiTypography>
        )}
        {commitsFiltres.map(commit => (
          <VuiBox key={commit.sha} component="li" mb={2} p={2} sx={{ bgcolor: '#1a0d16', borderRadius: 3, boxShadow: '0 2px 12px #ff4fa322', border: '1px solid #ff4fa322' }}>
            <VuiTypography fontWeight={700} sx={{ color: '#fff', fontSize: '1.08rem' }}>{commit.commit.message}</VuiTypography>
            <VuiTypography fontSize="0.98rem" sx={{ color: '#ff4fa3', mt: 0.5 }}>
              {commit.commit.author.name} — {new Date(commit.commit.author.date).toLocaleString()}
            </VuiTypography>
            <VuiTypography fontSize="0.93rem" sx={{ color: '#bfa2c8', mt: 0.5 }}>
              <a href={commit.html_url} target="_blank" rel="noopener noreferrer" style={{ color: '#bfa2c8', textDecoration: 'underline' }}>Voir sur GitHub</a>
            </VuiTypography>
          </VuiBox>
        ))}
      </VuiBox>
    </VuiBox>
  );
}

export default function PatchNote() {
  return (
    <>
      <VuiBox pt={3.5} pb={0.5} px={4} textAlign="center" sx={{ overflow: 'unset !important' }}>
        <Link to="/dashboard" style={{ display: 'block' }}>
          <img
            src={logoFlipstuff}
            alt="Flipstuff Logo"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 2px 12px #ff4fa355)',
              margin: 0,
              padding: 0,
              border: 0,
              boxSizing: 'border-box',
              maxWidth: 220
            }}
          />
        </Link>
      </VuiBox>
      <VuiBox py={2} px={2} minHeight="80vh" display="flex" flexDirection="column" alignItems="center" bgcolor="#0f0715">
        <Card sx={{ p: 4, maxWidth: 700, width: '100%', borderRadius: 6, bgcolor: '#1a0d16', color: '#fff', boxShadow: '0 4px 32px 0 #ff4fa355', border: '1.5px solid #ff4fa3' }}>
          <VuiTypography variant="h2" fontWeight="bold" mb={2} sx={{ color: '#ff4fa3', textShadow: '0 2px 16px #ff4fa355', letterSpacing: '0.01em', textAlign: 'center' }}>
            Patch Note
          </VuiTypography>
          <VuiTypography variant="h5" fontWeight={700} mb={2} sx={{ color: '#fff', textShadow: '0 1px 8px #ff4fa355', textAlign: 'center' }}>
            Nouveautés & Mises à jour
          </VuiTypography>
          <GithubPatchNotes />
        </Card>
      </VuiBox>
      <Footer />
    </>
  );
} 