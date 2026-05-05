require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const { parse } = require('csv-parse/sync')
const { createClient } = require('@supabase/supabase-js')

const dryRun = process.argv.includes('--dry-run')
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getJwtRole(token) {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64url').toString('utf8'))
        return payload.role
    } catch {
        return null
    }
}

if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não encontrado em .env.local')
    process.exit(1)
}

if (!serviceRoleKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrado em .env.local')
    process.exit(1)
}

if (getJwtRole(serviceRoleKey) !== 'service_role') {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não parece ser uma service_role key')
    process.exit(1)
}

const supabase = createClient(
    supabaseUrl,
    serviceRoleKey
)

const fileContent = fs.readFileSync('./cid10.csv', 'utf-8')

const parsedRows = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
})

const rows = parsedRows.map((row) => ({
    code: row.code || row.codigo || row.CAT,
    description: row.description || row.descricao || row.DESCRICAO,
})).filter((row) => row.code && row.description)

async function importar() {
    console.log(`CID-10: ${rows.length} registros preparados`)

    if (rows.length === 0) {
        console.error('❌ Nenhum registro válido encontrado em cid10.csv')
        process.exit(1)
    }

    if (dryRun) {
        console.log('Dry run OK: env, service role e CSV válidos. Nenhum dado foi enviado.')
        return
    }

    const batchSize = 500

    for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize)

        const { error } = await supabase
            .from('cid10')
            .upsert(batch, { onConflict: 'code' })

        if (error) {
            console.error(error)
            return
        }

        console.log(`Lote ${i / batchSize + 1} OK`)
    }

    console.log('✅ Finalizado')
}

importar()
