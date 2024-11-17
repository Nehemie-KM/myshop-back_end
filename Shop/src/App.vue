<template>
  <div id="app">
    <header class="header">
      <nav>
        <div class="aligner">
          <a href="#">
            <img class="logo" src="./assets/img/HyperPro2.png" alt="Logo HYPERprot" />
          </a>

          <div class="alligne" id="loupe">
            <img src="./assets/img/loupe (1).png" alt="Search Icon" class="minini gauche" />
            <form action="">
              <div id="search">
                <input
                  id="name"
                  type="search"
                  v-model="searchTerm"
                  required
                  placeholder="Rechercher..."
                />
                <label for="name"></label>
              </div>
            </form>
          </div>

          <div class="nav-links">
            <a href="#">Accueil</a>
            <a href="#">Produits</a>
          </div>
          <div class="cart-btn">
            <button @click="goToCart">Voir le panier ({{ cart.length }})</button>
          </div>

          <button @click="goToLogin">Login</button>
        </div>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenue chez HyperProt LE SITE pour les sportifs d'exeptions</h1>
          <p>Tous les produits que tu recherches t'attendent ici, alors n'attends pas pour les commander.</p>
          <a href="#shop" class="btn">Achetez maintenant</a>
        </div>
      </section>

      <div class="product-container">
        <div v-for="(product, index) in filteredProducts" :key="index" class="product-card">
          <img :src="product.image" :alt="product.name" width="200" />
          <h2>{{ product.name }}</h2>
          <p>{{ product.category }}</p>
          <p>{{ product.description }}</p>
          <p>{{ product.price }} €</p>
          <button @click="addToCart(product)">Ajouter au panier</button>
        </div>
      </div>

      <section class="promotions">
        <div class="promotion-banner">
          <h2>Offre Spéciale ! - 20% sur toute la boutique</h2>
          <p>Utilisez le code PROMO20 à la caisse.</p>
          <a href="#shop" class="btn">Shoppez maintenant</a>
        </div>
      </section>

      <section class="testimonials">
        <h2>Avis de nos clients</h2>
        <div class="testimonial">
          <p>"Produit incroyable, très satisfait de la qualité !" - Jean D.</p>
        </div>
        <div class="testimonial">
          <p>"Livraison rapide et service client impeccable !" - Marie S.</p>
        </div>
      </section>
    </main>

    <footer>
      <div class="alligne">
        <div class="footer-links">
          <a href="#">Mentions légales</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Conditions de vente</a>
        </div>
        <div class="footer-contact">
          <p>Contactez-nous : contact@monsite.com</p>
          <p>Suivez-nous sur :</p>
          <div class="social-media">
            <a href="#"><img src="#" alt="Facebook"></a>
            <a href="#"><img src="#" alt="Twitter"></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '',
      products: [],
      cart: [],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const searchTermLower = this.searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTermLower) ||
          product.category.toLowerCase().includes(searchTermLower)
        );
      });
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    },
    async addToCart(product) {
      try {
        await axios.post('http://localhost:3000/api/cart', product);
        this.cart.push(product);
        alert(`${product.name} a été ajouté au panier`);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToCart() {
      this.$router.push("/cart");
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>



<style>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  background-color: #333
}

#app {
  padding: 0; /* Suppression du padding */
  width: 100%;
  box-sizing: border-box; /* Assure que les marges et bordures sont incluses dans la largeur totale */
}

body {
  margin-top: 80px; /* Ajoute un espace pour compenser la hauteur du header */
  width: 100%;
  height: 100vh; /* Assure que le body occupe toute la hauteur de l'écran */
  display: flex;
  flex-direction: column;
}


.aligner {
  display: flex;
  justify-content: flex-start; /* Aligne à gauche par défaut */
  align-items: center;
  width: 100%;
}

#loupe {
  display: flex;
  align-items: center;
  padding: 5px 15px;
}

#search {
  position: relative;
  display: flex;
  align-items: center;
}

#name {
  border: 2px solid #cba45f; /* Bordure dorée */
  border-radius: 20px;
  padding: 10px 15px;
  width: 40vw; /* Largeur fixe, ajustable */
  font-size: 1rem;
  font-family: 'Playfair Display', serif;
  outline: none;
  transition: all 0.3s ease;
  color: #333;
}

#name:focus {
  border-color: #f9f7cd; /* Changer la couleur de la bordure au focus */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* Ombre au focus */
}

#name::placeholder {
  color: #888;
}
h2 {
  color: #cba45f;
}

.minini {
  width: 20px; /* Ajuste la taille de l'icône */
  height: 20px;
  margin-right: 10px; /* Un peu d'espace entre l'icône et le champ de texte */
}

.gauche {
  margin-left: 10px;
}

.nav-links {
  display: flex;
  gap: 6vw  ; /* Espace entre les liens de navigation */
  margin-left: 6vw; /* Ajuste l'espace entre le logo et "Accueil" */
  margin-right: 2vw;
}

.nav-links a {
  color: #cba45f;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 1.2rem;
  text-decoration: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-links a:hover {
  color: #f9f7cd; /* Couleur différente au survol */
  text-decoration: underline;
}

.login-btn {
  margin-left: 0; /* Pousse le bouton à droite */
}

.logo {
  height: 5vw;
  width: auto;
}

button {
  background-color: #cba45f;
  border: 2px  #f9f7cd;
  color: #f9f7cd;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s ease;
  text-transform: uppercase;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}
.cart-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #cba45f;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.cart-btn:hover {
  transform: scale(1.1);
}


/* Hero Section */
.hero {
  position: relative;
  height: 30vw; /* Modifie la hauteur selon ton besoin */
  background-size: cover;
  background-position: center;
  color: #cba45f;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 80px; /* Décale le contenu de la section en-dessous du header */
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 30px;
}

.hero .btn {
  padding: 10px 20px;
  background-color: #cba45f;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 18px;
}

.hero .btn:hover {
  background-color: #ff8c00;
}

/* Mise en page des produits */
.product-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-around;
  padding: 50px 20px;
 
}

/* Carte produit */
.product-card {
  background-color: #ffffff; /* Fond blanc */
  border: 1px solid #cba45f; /* Bordure couleur or */
  border-radius: 8px;
  padding: 20px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  color: #ffffff; /* Texte blanc par défaut */
}

.product-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 15px;
}

/* Style pour le texte en or */
.product-card h2,
.product-card p,
.product-card .price {
  color: #cba45f; /* Couleur or */
  font-family: 'Playfair Display', serif;
}

/* Style pour le bouton */
.product-card button {
  background-color: #cba45f;
  border: 2px solid #cba45f;
  color: #ffffff; /* Texte blanc sur le bouton */
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-card button:hover {
  background-color: #ff8c00;
  transform: translateY(-3px);
}

.product-card h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.product-card p {
  font-size: 16px;
  color: #555;
  margin: 5px 0;
}

.product-card .price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6200;
  margin-top: 10px;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
.hero, .promotions, .testimonials, footer {
  color: #cba45f; /* Couleur or */
}

.product-card h2,
.product-card p,
.product-card .price {
  background-color: transparent; /* Pas de fond noir */
  color: #cba45f; /* Couleur du texte en or */
  font-family: 'Playfair Display', serif;
}
.product-card h2,
.product-card p {
  margin: 0;
  padding: 0;
  background-color: transparent !important; /* Assure que le fond reste transparent */
}
footer p {
  color: #cba45f; /* Couleur or spécifique pour les textes dans ces sections */
}

footer a {
  color: #cba45f;
}

footer a:hover {
  color: #f9f7cd; /* Couleur différente au survol */
}

footer {
 
  color: #cba45f;
  padding: 20px;
  text-align: center;
  font-size: 14px;
  width: 100%;
  bottom: 0;
  left: 0;
}

</style>
