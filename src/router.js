import { createRouter, createWebHashHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import CategoryPage from './components/CategoryPage.vue';
import ItemDetail from './components/ItemDetail.vue';
import JsonGenerator from './components/JsonGenerator.vue';
import CartPage from './components/CartPage.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/category/:id', component: CategoryPage },
  { path: '/item/:id', component: ItemDetail },
  { path: '/json-generator', component: JsonGenerator },
  { path: '/cart', component: CartPage }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
