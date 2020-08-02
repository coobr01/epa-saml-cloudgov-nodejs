# Deployment to Cloud.gov
cf target -o epa-prototyping -s OWDEV
cf push -f manifest-proto.yml

# Test
Navigate to https://saml-test-proto.app.cloud.gov/
Log in using EPA creditionals 
If good, should be shown EPA attributes
