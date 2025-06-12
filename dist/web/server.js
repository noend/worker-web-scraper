"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(process.cwd(), 'src', 'web', 'views'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', async (req, res) => {
    const links = await prisma.link.findMany({
        orderBy: { id: 'desc' }
    });
    res.render('index', { links });
});
app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany({
        orderBy: { id: 'desc' }
    });
    res.render('products', { products });
});
app.post('/links', async (req, res) => {
    const { url } = req.body;
    await prisma.link.create({
        data: {
            url,
            visited: false
        }
    });
    res.redirect('/');
});
app.post('/links/:id/delete', async (req, res) => {
    const { id } = req.params;
    await prisma.link.delete({
        where: { id: parseInt(id) }
    });
    res.redirect('/');
});
app.post('/links/:id/reset', async (req, res) => {
    const { id } = req.params;
    await prisma.link.update({
        where: { id: parseInt(id) },
        data: { visited: false }
    });
    res.redirect('/');
});
const port = 8080;
app.listen(port, () => {
    console.log(`Web UI is running on http://localhost:${port}`);
});
