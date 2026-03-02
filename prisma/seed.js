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

    await prisma.cliente.createMany({
        data: [
            {
                nome: 'Maria Silva',
                telefone: 11987654321,
                email: 'maria.silva@email.com',
                cpf: 12345678900,
                cep: 1234567,
                logradouro: 'Rua das Flores',
                bairro: 'Jardim das Flores',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'João Oliveira',
                telefone: 11987654322,
                email: 'joao.oliveira@email.com',
                cpf: 98765432100,
                cep: 1234568,
                logradouro: 'Avenida Brasil',
                bairro: 'Centro',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Ana Santos',
                telefone: 11987654323,
                email: 'ana.santos@email.com',
                cpf: 45678912300,
                cep: 13270000,
                logradouro: 'Rua das Acácias',
                bairro: 'Vila Nova',
                localidade: 'Valinhos',
                uf: 'SP',
            },
            {
                nome: 'Carlos Mendes',
                telefone: 11987654324,
                email: 'carlos.mendes@email.com',
                cpf: 32165498700,
                cep: 1234569,
                logradouro: 'Rua do Comércio',
                bairro: 'Vila Mariana',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Juliana Costa',
                telefone: 11987654325,
                email: 'juliana.costa@email.com',
                cpf: 15975345600,
                cep: 1234570,
                logradouro: 'Avenida Paulista',
                bairro: 'Bela Vista',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Roberto Alves',
                telefone: 11987654326,
                email: 'roberto.alves@email.com',
                cpf: 85296314700,
                cep: 1234571,
                logradouro: 'Rua Augusta',
                bairro: 'Centro',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Fernanda Dias',
                telefone: 11987654327,
                email: 'fernanda.dias@email.com',
                cpf: 74185296300,
                cep: 1234572,
                logradouro: 'Rua Oscar Freire',
                bairro: 'Pinheiros',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Lucas Ferreira',
                telefone: 11987654328,
                email: 'lucas.ferreira@email.com',
                cpf: 36925814700,
                cep: 1234573,
                logradouro: 'Rua Consolação',
                bairro: 'Centro',
                localidade: 'São Paulo',
                uf: 'SP',
            },
            {
                nome: 'Beatriz Rocha',
                telefone: 11987654329,
                email: 'beatriz.rocha@email.com',
                cpf: 65432178900,
                cep: 1234574,
                logradouro: 'Avenida Imigrantes',
                bairro: 'Vila Mariana',
                localidade: 'São Paulo',
                uf: 'SP',
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
