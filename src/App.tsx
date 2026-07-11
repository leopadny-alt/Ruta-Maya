import {
  lazy,
  Suspense,
  useCallback,
  useState,
} from "react";
import AppErrorBoundary from "./components/AppErrorBoundary";
import BottomNavigation, {
  type Tab,
} from "./components/BottomNavigation";
import ConnectionStatus from "./components/ConnectionStatus";
import PageLoader from "./components/PageLoader";
import PageTransition from "./components/PageTransition";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";

const MapPage = lazy(
  () => import("./pages/MapPage"),
);

const Itinerary = lazy(
  () => import("./pages/Itinerary"),
);

const Budget = lazy(
  () => import("./pages/Budget"),
);

const More = lazy(
  () => import("./pages/More"),
);

function App() {
  const [activeTab, setActiveTab] =
    useState<Tab>("home");

  const [showSplash, setShowSplash] =
    useState(true);

  const completeSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  function navigateTo(tab: Tab) {
    if (tab === activeTab) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setActiveTab(tab);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  let currentPage;

  if (activeTab === "home") {
    currentPage = (
      <Home onNavigate={navigateTo} />
    );
  } else if (activeTab === "map") {
    currentPage = <MapPage />;
  } else if (activeTab === "itinerary") {
    currentPage = <Itinerary />;
  } else if (activeTab === "budget") {
    currentPage = <Budget />;
  } else {
    currentPage = <More />;
  }

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={completeSplash}
      />
    );
  }

  return (
    <AppErrorBoundary>
      <ConnectionStatus />

      <Suspense fallback={<PageLoader />}>
        <PageTransition pageKey={activeTab}>
          {currentPage}
        </PageTransition>
      </Suspense>

      <BottomNavigation
        activeTab={activeTab}
        onChange={navigateTo}
      />
    </AppErrorBoundary>
  );
}

export default App;