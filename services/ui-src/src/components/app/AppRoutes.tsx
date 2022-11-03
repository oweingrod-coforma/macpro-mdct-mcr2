import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  AdminBannerProvider,
  AdminPage,
  DashboardPage,
  HelpPage,
  HomePage,
  McparGetStartedPage,
  McparReviewSubmitPage,
  NotFoundPage,
  ProfilePage,
  ReportPageWrapper,
} from "components";
import { mcparReportRoutesFlat } from "forms/mcpar";
// utils
import { ReportRoute } from "types";
import { ScrollToTopComponent, useUser } from "utils";

export const AppRoutes = () => {
  const { userIsAdmin } = useUser().user ?? {};
  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <AdminBannerProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          <Route path="/help" element={<HelpPage />} />

          {/* MCPAR ROUTES */}
          <Route path="/mcpar" element={<DashboardPage />} />
          <Route path="/mcpar/get-started" element={<McparGetStartedPage />} />
          {mcparReportRoutesFlat.map((route: ReportRoute) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.pageType ? (
                  // if report route with form
                  <ReportPageWrapper route={route} />
                ) : (
                  <McparReviewSubmitPage />
                )
              }
            />
          ))}
          <Route path="/mcpar/*" element={<Navigate to="/mcpar" />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
