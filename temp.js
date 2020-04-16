var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template:
    `<div class="product">
        
            <div class="product-image">
                <img v-bind:src="image">
            </div>
        
            <div class="product-info">
                <span class="onSale" v-show="onSale">On Sale {{ salePrice }}% off</span>
                <h1>{{ title }}</h1>
                <a v-bind:href="link">More product details...</a>
                <p v-if="inStock > 10">In Stock - {{ inStock }} available</p>
                <p v-else-if="inStock > 0 && inStock <= 10">Almost sold out - only {{ inStock }} available</p>
                <p v-else 
                   :class="{ outOfStock: inStock==0}"
                   >Out Of Stock</p>
                <p>User is premium: {{ premium}}</p>
                <p>Shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <!-- replaced with component product-details 
                    <ul>
                        <li v-for="detail of details">{{ detail }}</li>
                    </ul>
                -->

                <div class="color-boxes">
                    <div v-for="(variant, index) in variants" 
                         :key="variant.variantId"
                         class="color-box"
                         :style="{backgroundColor: variant.variantColor }"
                         @mouseover="updateProduct(index)"
                         >
                    </div>
                </div>

                <product-sizes :sizes="sizes"></product-sizes>
                
                <!--  replaced with component product-sizes  
                <ul>
                    <li v-for="size in sizes" :key="size">Size : {{ size }}</li>
                </ul>
                -->

                <div>
                    <button v-on:click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock}"
                        >Add To Cart
                    </button>
                </div>
                <div>
                    <button v-on:click="removeFromCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                        >Remove From Cart
                    </button>
                </div>
            </div>
        
            <product-tabs :reviews="reviews"></product-tabs>

    </div>
    `,
    data() {
        return {
            brand: "Vue Mastery",
            product: "Socks",
            description: "Green Socks",
            selectedVariant: 0,
            link: "https://www.vuemastery.com/courses/intro-to-vue-js/attribute-binding",
            onSale: false,
            details: ["80% Cotton", "20% Polyester", "Gender Neutral"],
            variants: [
                {variantId: 2234, variantColor: "Green",  variantImage: "./vmSocks-green-onWhite.jpg", variantQuantity: 10, variantSale: 50},
                {variantId: 2235, variantColor: "Blue",   variantImage: "./vmSocks-blue-onWhite.jpg",  variantQuantity: 5,  variantSale: 75},
                {variantId: 2236, variantColor: "Yellow", variantImage: "./vmSocks-Yellow-onWhite.jpg", variantQuantity: 0, variantSale: 20},
            ],
            sizes: ["S","M","L","XL","XXL"],
            reviews: []
        }
    },
    methods: {
        addToCart () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
    },
    computed: {
        title() {
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        salePrice() {
            return this.variants[this.selectedVariant].variantSale
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return "4.99"
            }
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {this.reviews.push(productReview)})
    }
})

Vue.component('product-sizes', {
    props: {
        sizes: {
            type: Array,
            required: true
        }
    },
    template: `<ul>
                    <li v-for="size in sizes" :key="size">Size : {{ size }}</li>
                </ul>
               `
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `<ul>
                    <li v-for="detail of details">{{ detail }}</li>
                </ul>
               `
})
    
Vue.component('product-review', {
    template:
    `<form class="review-form" @submit.prevent="onSubmit">
        <h2>Write A Review</h2>
        <p classs="errors" v-if="errors.length">
            <b>Please correct the following errors(s)</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
        </p>

        <p>Would you recommend this product ?
            <label for="yes">Yes</label>
            <input class="input-radio" type="radio" id="yes" name="recommendation" value="Yes" v-model="recommendation" />
            <label for="no">No</label>
            <input class="input-radio" type="radio" id="no" name="recommendation" value="No"  v-model="recommendation" />
        </p>

        <p>
            <input type="submit" value="Submit">  
        </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {

            this.errors = []
            
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                }
            
            eventBus.$emit('review-submitted', productReview)
                
            this.name = null
            this.review = null
            this.rating = null
            this.recommendation = null

            } else {
                if (!this.name)   this.errors.push("Name Required")
                if (!this.review) this.errors.push("Review Required")
                if (!this.rating) this.errors.push("Rating Required")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
      reviews: {
            type: Array,  
            required: true
      } 
    },
    template: 
    `<div>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab"
                >{{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">No Reviews Submitted yet for this product</p>    
                <ul v-else>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p><b>Name:</b> {{ review.name  }}     <b>Rating:</b> {{ review.rating }}</p>
                        <p><b>Review:</b></br> {{ review.review }}</p>
                        <p v-if="review.recommendation=='Yes'"><b>Recommended:</b> {{ review.recommendation }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>

        </div>
      `,
      data() {
        return {
            tabs: ['Reviews', 'Make a Review'],      
            selectedTab: "Reviews"
        }
      }
    })

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateAddCart (id) {
            this.cart.push(id)
        },
        updateRemoveCart () {
            if (this.cart.length > 0) {
                this.cart.pop()
            }
        }
    }
})