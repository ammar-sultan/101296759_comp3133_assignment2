import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideApollo } from "apollo-angular";
import { inject } from "@angular/core";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: "https://one01296759-comp3133-assignment2.onrender.com/graphql",
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
});
