# RG Presentes — cópia das páginas públicas

Reprodução do site https://saastop.vercel.app/ em 4 de outubro de 2026.

O diretório `dist` contém HTML, CSS, fontes e imagens locais das 13 páginas públicas. `replica.js` implementa banners, navegação móvel, catálogo com busca e filtros, galeria e quantidade/ideia no link de orçamento do WhatsApp. As dúvidas usam elementos HTML nativos.

Para visualizar: `python -m http.server 4173 --directory dist`.

Os links de WhatsApp e Instagram mantêm os destinos do site original. A área Admin direciona ao site original: não há cópia do backend, banco de dados nem autenticação. O arquivo de vídeo indicado pela referência retorna HTML, e por isso não é reproduzível na origem.
