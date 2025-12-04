import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkHomepage() {
  try {
    console.log('🔍 Checking homepage configuration...')
    
    const homepage = await prisma.homepage.findFirst()
    
    if (!homepage) {
      console.log('❌ No homepage configuration found!')
      return
    }
    
    console.log('✅ Homepage found!')
    console.log('📄 Sections:', homepage.sections.length)
    
    homepage.sections.forEach((section: any, index: number) => {
      console.log(`\n📌 Section ${index + 1}:`)
      console.log(`   Type: ${section.type}`)
      console.log(`   Title: ${section.title}`)
      console.log(`   Active: ${section.active}`)
      console.log(`   Order: ${section.order}`)
      
      if (section.type === 'products' && section.content?.productIds) {
        console.log(`   Product IDs: ${section.content.productIds.length}`)
        console.log(`   IDs: ${section.content.productIds.join(', ')}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkHomepage()
