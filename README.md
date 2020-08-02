# Requirements
 - Work with EAIM to register your app so that is can call EPA SAML service

# Deployment to Cloud.gov
 - cf target -o epa-prototyping -s OWDEV
 - cf push -f manifest-proto.yml
 - cf logs saml-test-proto

# Test
- Navigate to https://saml-test-proto.app.cloud.gov/
- Log in using EPA creditionals 
- If good, should be shown EPA attributes
