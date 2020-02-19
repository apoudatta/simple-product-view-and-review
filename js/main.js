
Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div>
			<div class="row">
				<div class="col-sm-4 offset-sm-1">
		  		<img :src="image" class="rounded" alt="" height="400" width="350">
		  	</div>
		  	<div class="col-sm-6 offset-sm-1">
					<h1>{{ title }}</h1>
					
					<div class="row">
						<div class="col-sm-10">
							<p v-if="inStock"><b>In Stock</b></p>
							<p v-else class="text-danger"><b>Out of Stock</b></p>
							<p>Shipping: {{ shipping }}</p>
						</div>
						
					</div>
					
					<h2>Details</h2>
					<ul>
						<li v-for="detail in details">{{ detail}}</li>
					</ul>

					<h3>Colors</h3>
					<div v-for="(variant, index) in variants" 
								:key="variant.variantId"
								class="clr_block mt-2"
								:style="{backgroundColor: variant.variantColor}"
								@mouseover="updateProduct(index)">
					</div>

					<button style="margin-top: 20px" class="btn btn-info" :class="{ disabled: !inStock }" v-on:click="addToCart" :disabled="!inStock">Add To Cart</button>
		  	</div>

			</div>

			<div class="row">
				<div class="col-sm-7 mt-4 mb-4">
					<div class="card">
					  <div class="card-body">
					    <h5 class="card-title text-center">Reviews...</h5>
					    <ul v-if="!reviews.length" class="list-group">
							  <li class="list-group-item text-danger">There are no reviews yet!</li>
							</ul>
					    <table v-else class="table">
						    <thead>
						      <tr>
						        <th>Name</th>
						        <th>Review</th>
						        <th>Rating</th>
						      </tr>
						    </thead>
						    <tbody>
						      <tr v-for="review in reviews">
						        <td>{{ review.name }}</td>
						        <td>{{ review.review }}</td>
						        <td>{{ review.rating }}</td>
						      </tr>
						    </tbody>
						  </table>
					  </div>
					</div>
				</div>

				<product-review @review-submitted="addReview"></product-review>

			</div>

			
		</div>
	`,
	data() {
		return {
			brand: 'One Man',
			product: 'Socks',
			selectedVariant: 0,
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			variants: [
				{
					variantId: 2234,
					variantColor: "green",
					variantImage: 'images/green-socks.png',
					variantQuantity: 10
				},
				{
					variantId: 2235,
					variantColor: "steelblue",
					variantImage: 'images/blue-socks.png',
					variantQuantity: 0
				}
			],
			reviews: []
		}
	},

	methods: {
		addToCart(){
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
		},
		updateProduct(index){
			this.selectedVariant = index
			console.log(index)
		},
		addReview(productReview) {
			this.reviews.push(productReview)
		}
	},
	computed:{
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity
		},
		shipping() {
			if(this.premium) {
				return "Free"
			}
			return 2.99
		}
	}

})


Vue.component('product-review', {
	template: `
		<div class="col-sm-5 mt-4 mb-4">
			<div class="card">
			  <div class="card-body">
			    <h5 class="card-title">Give a Review</h5>

			    <div v-if="errors.length" v-for="error in errors" class="alert alert-danger alert-dismissible">
					  <button type="button" class="close" data-dismiss="alert">&times;</button>
					  <strong>Alert!</strong> {{ error }}
					</div>

			    <form @submit.prevent="onSubmit">
					  <div class="form-group">
					    <label for="name">Name:</label>
					    <input type="text" v-model="name" class="form-control" placeholder="Enter name" id="name">
					  </div>
					  <div class="form-group">
					    <label for="pwd">Review:</label>
					    <textarea v-model="review" class="form-control"></textarea>
					  </div>
					  <div class="form-group">
					    <label for="pwd">Rating:</label>
					    <select v-model.number="rating" class="form-control">
					    	<option>5</option>
					    	<option>4</option>
					    	<option>3</option>
					    	<option>2</option>
					    	<option>1</option>
					    </select>
					  </div>
					  <button type="submit" class="btn btn-primary">Submit</button>
					</form>
			  </div>
			</div>
		</div>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating
			}
			this.$emit('review-submitted', productReview)
			this.name = null
			this.review = null
			this.rating = null
			this.errors = []
			}
			else {
				if (!this.name) this.errors.push("Name required.")
				if (!this.review) this.errors.push("Review required.")
				if (!this.rating) this.errors.push("Rating required.")
			}
			
		}
	}
})


var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods:{
		updateCart(id) {
			this.cart.push(id)
		}
	}
})

