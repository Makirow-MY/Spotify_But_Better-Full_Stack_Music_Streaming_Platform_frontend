import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";


const PUBLISHABLE_KEY = "pk_test_aGlwLW1pbmstNTkuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			
	</StrictMode>
);
