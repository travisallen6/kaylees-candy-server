export default [
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
    '$lookup': {
      'from': 'products',
      'localField': 'productsOrdered.productId',
      'foreignField': '_id',
      'as': 'product'
    }
  }, {
    '$unwind': {
      'path': '$product'
    }
  }, {
    '$addFields': {
      'productName': '$product.name',
      'productTotal': {
        '$multiply': [
          '$productsOrdered.quantity', '$productsOrdered.price'
        ]
      },
      'qtyOrdered': '$productsOrdered.quantity',
      'productPrice': '$productsOrdered.price',
      'product': '$$REMOVE',
      'productsOrdered': '$$REMOVE'
    }
  }, {
    '$lookup': {
      'from': 'users',
      'localField': 'customerId',
      'foreignField': '_id',
      'as': 'customer'
    }
  }, {
    '$unwind': {
      'path': '$customer'
    }
  }, {
    '$project': {
      'customer.hash': 0
    }
  }, {
    '$group': {
      '_id': '$customerId',
      'customerId': {
        '$first': '$customerId'
      },
      'createdAt': {
        '$first': '$createdAt'
      },
      'updatedAt': {
        '$first': '$updatedAt'
      },
      'address': {
        '$first': '$address'
      },
      'deliveryDate': {
        '$first': '$deliveryDate'
      },
      'confirmation': {
        '$first': '$confirmation'
      },
      'confirmedAt': {
        '$first': '$confirmedAt'
      },
      'customer': {
        '$first': '$customer'
      },
      'totalDue': {
        '$sum': '$productTotal'
      },
      'productsOrdered': {
        '$push': {
          'productName': '$productName',
          'qtyOrdered': '$qtyOrdered',
          'productPrice': '$productPrice'
        }
      }
    }
  }
]