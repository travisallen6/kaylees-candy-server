import { Types } from 'mongoose'

export default function productQuantitiesForProductIds(lookupProducts: string[]) {
  return [
    {
      '$match': {
        'boxQuantity': {
          '$exists': true
        }
      }
    }, {
      '$unwind': {
        'path': '$boxContents'
      }
    }, {
      '$match': {
        'boxContents': {
          '$in': lookupProducts.map(id => new Types.ObjectId(id))
        }
      }
    }, {
      '$lookup': {
        'from': 'products',
        'localField': 'boxContents',
        'foreignField': '_id',
        'as': 'product'
      }
    }, {
      '$addFields': {
        'product': {
          '$arrayElemAt': [
            '$product', 0
          ]
        }
      }
    }, {
      '$addFields': {
        'product.totalQuantity': {
          '$multiply': [
            '$boxQuantity', '$product.countPerBox'
          ]
        },
        'product.countPerBox': '$$REMOVE'
      }
    }, {
      '$replaceRoot': {
        'newRoot': '$product'
      }
    }, {
      '$lookup': {
        'from': 'orders',
        'let': {
          'productId': '$_id'
        },
        'pipeline': [
          {
            '$match': {
              'customerId': {
                '$exists': true
              }
            }
          }, {
            '$unwind': {
              'path': '$productsOrdered'
            }
          }, {
            '$replaceRoot': {
              'newRoot': '$productsOrdered'
            }
          }, {
            '$group': {
              '_id': '$productId',
              'productId': {
                '$first': '$productId'
              },
              'quantity': {
                '$sum': '$quantity'
              }
            }
          }, {
            '$match': {
              '$expr': {
                '$eq': [
                  '$$productId', '$_id'
                ]
              }
            }
          }
        ],
        'as': 'orders'
      }
    }, {
      '$unwind': {
        'path': '$orders'
      }
    }, {
      '$addFields': {
        'quantityLeft': {
          '$subtract': [
            '$totalQuantity', '$orders.quantity'
          ]
        }
      }
    }, {
      '$project': {
        '_id': 1,
        'quantityLeft': 1
      }
    }
  ]
}