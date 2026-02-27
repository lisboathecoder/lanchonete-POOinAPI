import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela lanchonete...');

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.produto.createMany({
        data: [
            {
                nome: 'X-Burguer Clássico',
                descricao: 'Pão, blend bovino 150g, queijo prato e maionese artesanal.',
                categoria: 'LANCHE',
                preco: 28.9,
                ativo: true,
            },
            {
                nome: 'X-Salada Especial',
                descricao: 'Pão, blend bovino, queijo, alface, tomate e cebola roxa.',
                categoria: 'LANCHE',
                preco: 32.0,
                ativo: true,
            },
            {
                nome: 'Coca-Cola Lata',
                descricao: 'Refrigerante 350ml gelado.',
                categoria: 'BEBIDA',
                preco: 7.0,
                ativo: true,
            },
            {
                nome: 'Suco de Laranja Natural',
                descricao: 'Suco de laranja 400ml, sem adição de açúcar.',
                categoria: 'BEBIDA',
                preco: 12.5,
                ativo: true,
            },
            {
                nome: 'Pudim de Leite Moça',
                descricao: 'Fatia individual de pudim com calda de caramelo.',
                categoria: 'SOBREMESA',
                preco: 14.0,
                ativo: true,
            },
            {
                nome: 'Petit Gateau',
                descricao: 'Bolinho quente de chocolate com sorvete de baunilha.',
                categoria: 'SOBREMESA',
                preco: 22.9,
                ativo: true,
            },
            {
                nome: 'Combo Casal',
                descricao: '2 X-Saladas + 1 Porção de Batata G + 2 Refris lata.',
                categoria: 'COMBO',
                preco: 85.0,
                ativo: true,
            },
            {
                nome: 'Combo Kids',
                descricao: '1 Cheeseburguer pequeno + 1 Suco de caixinha + Brinde.',
                categoria: 'COMBO',
                preco: 39.9,
                ativo: true,
            },
            {
                nome: 'Hot Dog Especial',
                descricao: 'Pão de leite, duas salsichas, purê, batata palha e molho.',
                categoria: 'LANCHE',
                preco: 18.5,
                ativo: true,
            },
            {
                nome: 'Brownie com Nozes',
                descricao: 'Brownie artesanal com pedaços de nozes.',
                categoria: 'SOBREMESA',
                preco: 11.0,
                ativo: true,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
