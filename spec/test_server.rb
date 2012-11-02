require "sinatra"
require "json"

# this might have unintended security consequences...
# personally I dont think this that bad as long as the API doesn't look at cookies for auth...
set :protection, :except => :json_csrf

# sync stdout for foreman/heroku. helps `puts` show up in logs correctly
$stdout.sync = true

before do
  headers['Access-Control-Allow-Origin'] = '*'
  content_type :json
  status 200
end

get "/location/last" do
  {
    latitude: 45, longitude: 45
  }.to_json
end

post "/location/update" do
  puts params.inspect
  params.to_json
end

get "/error" do
  { 
    error: {
      type: "static_error",
      message: "this is a generic error message"    
    }
  }.to_json
end

post "/error" do
  { 
    error: {
      type: "static_error",
      message: "this is a generic error message"    
    }
  }.to_json
end