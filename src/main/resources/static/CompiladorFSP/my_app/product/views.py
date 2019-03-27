from flask import abort, jsonify
from flask_restful import Resource
from flask_restful import reqparse
from my_app import api
 
parser = reqparse.RequestParser()
# parser.add_argument('name', type=str)
# parser.add_argument('price', type=float)
 
 
@catalog.route('/')
@catalog.route('/home')
def home():
    return "Welcome to the Catalog Home."
 
 
class ProductApi(Resource):

    def get(self):
        print("================")
        res = { "Nome" : "Davi" }
        return jsonify(res)
 
    # def get(self, id=None, page=1):
    #     if not id:
    #         products = Product.query.paginate(page, 10).items
    #     else:
    #         products = [Product.query.get(id)]
    #     if not products:
    #         abort(404)
    #     res = {}
    #     for product in products:
    #         res[product.id] = {
    #             'name': product.name,
    #             'price': product.price,
    #         }
    #     return json.dumps(res)
 
    # def post(self):
    #     args = parser.parse_args()
    #     name = args['name']
    #     price = args['price']
    #     product = Product(name, price)
    #     db.session.add(product)
    #     db.session.commit()
    #     res = {}
    #     res[product.id] = {
    #         'name': product.name,
    #         'price': product.price,
    #     }
    #     return json.dumps(res)
 
api.add_resource(
   ProductApi,
   '/api/product',
   # '/api/product/<int:id>',
   # '/api/product/<int:id>/<int:page>'
)