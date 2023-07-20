const { Auth } = require("@orosound/auth_client_sdk_nodejs");

export interface AuthorizationResponseJson {
  code: string;
  state: string;
}

export class AuthorizationResponse {
  code: string;
  state: string;

  constructor(response: AuthorizationResponseJson) {
    this.code = response.code;
    this.state = response.state;
  }

  toJson(): AuthorizationResponseJson {
    return { code: this.code, state: this.state };
  }
}

const oro_provider = {
  name: "orosound",
  openIdConnectUrl: "http://localhost:8001",
  clientId: "foo",
  redirectUri: "com.example.app://auth/callback",
  scope: "openid name profile email offline_access",
  responseType: "code",
  extras: { prompt: "consent", access_type: "offline" },
};

const auth = new Auth(
  oro_provider.openIdConnectUrl,
  oro_provider.clientId,
  oro_provider.redirectUri,
  oro_provider.scope,
  oro_provider.responseType,
  oro_provider.extras
);

let counter = 0;

export async function login() {
  counter++;
  console.log("login", counter);
  await auth.fetchServiceConfiguration();
  auth.openAuthUrl();
}

export async function tokenFlow(url: string) {
  const parseUrl = new URL(url);
  console.log(parseUrl.searchParams.get("code"));
  console.log(parseUrl.searchParams.get("state"));
  auth.authorizationResponse = new AuthorizationResponse({
    code: parseUrl.searchParams.get("code"),
    state: parseUrl.searchParams.get("state"),
  });
  await auth.makeTokenRequest();
  await auth.refreshAccessToken();
}


// export async function oroAuth(url: string) {
//   tokenFlow(url).then(() => {

// }
