import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authApi } from './api/auth';
import { clearAuth, setCredentials, setHydrated, setUser } from './store/authSlice';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import StoryEditorPage from './pages/StoryEditorPage';
import GenerateStoryPage from './pages/GenerateStoryPage';
import CustomizeStoryPage from './pages/CustomizeStoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileDetailsPage from './pages/ProfileDetailsPage';
import ChangeEmailPage from './pages/ChangeEmailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ExportDataPage from './pages/ExportDataPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import AdminPage from './pages/AdminPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DataPolicyPage from './pages/DataPolicyPage';
import PublishedStoriesPage from './pages/PublishedStoriesPage';
import NotFoundPage from './pages/NotFoundPage';

const AppBootstrap = () => {
  const dispatch = useDispatch();
  const { accessToken, user, hydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      if (!accessToken) {
        dispatch(setHydrated(true));
        return;
      }

      if (user) {
        dispatch(setHydrated(true));
        return;
      }

      try {
        const profile = await authApi.me();
        if (!isMounted) {
          return;
        }

        dispatch(setUser(profile.user || profile));
        if (profile.accessToken) {
          dispatch(
            setCredentials({
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
              user: profile.user || profile,
            })
          );
        }
      } catch {
        if (isMounted) {
          dispatch(clearAuth());
        }
      } finally {
        if (isMounted) {
          dispatch(setHydrated(true));
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [accessToken, dispatch, user]);

  if (!hydrated) {
    return <div className="loading-screen">Loading AnantaKatha...</div>;
  }

  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  // Public-only pages where authenticated users should not stay
  const publicAuthPages = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];

  useEffect(() => {
    const onNavigate = (event) => {
      if (event.detail?.to) {
        navigate(event.detail.to, { replace: Boolean(event.detail.replace) });
      }
    };

    window.addEventListener('anantakatha:navigate', onNavigate);
    return () => window.removeEventListener('anantakatha:navigate', onNavigate);
  }, [navigate]);

  // Redirect authenticated users away from public login/auth pages to dashboard
  useEffect(() => {
    if (status === 'authenticated' && publicAuthPages.includes(location.pathname)) {
      navigate('/dashboard', { replace: true });
    }
  }, [status, location.pathname, navigate]);

  return (
    <Layout key={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/published" element={<PublishedStoriesPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/data-policy" element={<DataPolicyPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories"
          element={
            <ProtectedRoute>
              <StoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/new"
          element={
            <ProtectedRoute>
              <StoryEditorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/stories/:storyId" element={<StoryDetailPage />} />
        <Route
          path="/stories/:storyId/customize"
          element={
            <ProtectedRoute>
              <CustomizeStoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/:storyId/edit"
          element={
            <ProtectedRoute>
              <StoryEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GenerateStoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/details"
          element={
            <ProtectedRoute>
              <ProfileDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/change-email"
          element={
            <ProtectedRoute>
              <ChangeEmailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/export-data"
          element={
            <ProtectedRoute>
              <ExportDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/delete-account"
          element={
            <ProtectedRoute>
              <DeleteAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <>
      <AppBootstrap />
      <AppRoutes />
    </>
  );
}