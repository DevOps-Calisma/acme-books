How to test APIs of this project using Curl ?


**Add new user:**
curl -X POST -H "Content-Type: application/json" -d '{"first_name": "xxxxxxx", "email": "xxxxxxx"}' http://localhost:5003/add-user

**Add new item:**
curl -X POST \
  http://localhost:5002/inventory/add-item \
  -H 'Content-Type: application/json' \
  -H 'is-admin: 'true'\
  -d '{
    "item_name": "xxxxxx",
    "author": "xxxxxx",
    "price": xxxxxx,
    "image_url": "xxxxxx",
    "stock": xxxxxx
  }'

**Add new order:**

curl -X POST \
  http://localhost:5004/api/create-order \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": xxxx, 
    "order_id": "xxxx",
    "item_id": xxxx, 
    "stock": xxxx
  }'
  
