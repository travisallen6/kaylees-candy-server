const pipeline = [
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
      },
      'totalQuantity': '$$REMOVE',
      'orders': '$$REMOVE'
    }
  }
]

export default pipeline;