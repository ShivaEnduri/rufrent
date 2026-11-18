



// src/UserView/components/InitialLandingView/FooterViews/FooterPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppAwareNavbar from "../../../../components/CommonViews/AppAwareNavbar";
import { getFooterSections } from "../../../../components/CommonViews/menuDropdown/FooterSections";

// Views
import RRPackage from "./InitialFooterRRPackageView";
import AboutRufrent from "./InitialFooterAboutView";
import TenantsDoc from "./InitialFooterTenantsView";
import OwnersDoc from "./InitialFooterOwnersView";
import TermsAndConditions from "./InitialFooterTermsView";
import Team from "./InitialFooterTeamView";
import ContactUs from "./InitialContactUs";

import { FOOTER_PATH } from "../../../../routes/routesPath";

// Map IDs to components
const sectionComponents = {
  "about-us": <AboutRufrent />,
  "rr-package": <RRPackage />,
  "tenants": <TenantsDoc />,
  "owners": <OwnersDoc />,
  "terms-and-conditions": <TermsAndConditions />,
  "team": <Team />,
  "contact-us": <ContactUs />,
};

const FooterPage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  // Extract app from URL: ?app=studio or ?app=rentals
  const urlParams = new URLSearchParams(search);
  const currentApp = urlParams.get("app") || "rentals";

  // Get only allowed sections for this app
  const allowedSections = getFooterSections(currentApp);

  // Map to full section objects with content
  const footerSections = allowedSections.map((item) => ({
    ...item,
    content: sectionComponents[item.id] || <div>Content not found</div>,
  }));

  // Find active section (fallback to first allowed)
  const activeSection = footerSections.find((s) => s.id === section) || footerSections[0];

  return (
    <>
      <AppAwareNavbar />
      <div className="container mx-auto p-6 pt-0.5">
        {/* Top Sticky Tabs */}
        <div className="fixed top-0 left-0 w-full mt-[72px] lg:mt-20 bg-white border-b z-10">
          <div className="flex justify-center overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-4 sm:grid-cols-2 md:flex space-x-1 px-2 py-1 md:py-2 flex-wrap">
              {footerSections.map((item) => (
                <button
                  key={item.id}
                  className={`px-4 py-1 text-sm font-semibold ${
                    item.id === activeSection.id
                      ? "rounded-lg text-white bg-blue-500"
                      : "text-[#001433]"
                  }`}
                  onClick={() =>
                    navigate(`${FOOTER_PATH}/${item.id}?app=${currentApp}`)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-28 md:mt-20">{activeSection.content}</div>
      </div>
    </>
  );
};

export default FooterPage;