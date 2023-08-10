import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://demo-admin-portal.sunbirdrc.oci/auth",
 realm: "sunbird-rc",
 clientId: "registry-frontend",
});

export default keycloak;