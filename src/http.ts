import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from "socket.io";

const app = express();

//Liberando acesso dos arquivos da pasta public para acessar pro rotas
app.use(express.static(path.join(__dirname, "..", "public")));

const httpServer = http.createServer(app);

const io = new Server(httpServer);

export { httpServer, io };