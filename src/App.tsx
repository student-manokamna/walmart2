
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ProductsProvider } from "./context/ProductsContext";
import { NavigationProvider } from "./context/NavigationContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { HealthProvider } from "./context/HealthContext";
import Header from "./components/Header";
import SmartNavigation from "./components/SmartNavigation";
import AIChatbot from "./components/AIChatbot";
import QRScanner from "./components/QRScanner";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Customise from "./pages/Customise";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <AccessibilityProvider>
          <HealthProvider>
            <ProductsProvider>
              <NavigationProvider>
                <ChatbotProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="min-h-screen bg-background">
                      <Header />
                      <SmartNavigation />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/customise" element={<Customise />} />
                        <Route path="/checkout" element={<Checkout />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <AIChatbot />
                      <QRScanner />
                    </div>
                  </BrowserRouter>
                </ChatbotProvider>
              </NavigationProvider>
            </ProductsProvider>
          </HealthProvider>
        </AccessibilityProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
