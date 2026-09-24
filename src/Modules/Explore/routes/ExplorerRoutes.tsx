import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import ExplorePage from "../ExplorePage";


export const ExplorerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "explorar",
    component: ExplorePage,
});