#!/usr/bin/env python3
"""
Gera os ícones PWA (192x192 e 512x512) a partir do favicon.svg.
Execute: python3 generate-icons.py
Requer: pip install cairosvg
"""
try:
    import cairosvg
    cairosvg.svg2png(url="favicon.svg", write_to="pwa-192x192.png", output_width=192, output_height=192)
    cairosvg.svg2png(url="favicon.svg", write_to="pwa-512x512.png", output_width=512, output_height=512)
    print("✅ Ícones gerados: pwa-192x192.png e pwa-512x512.png")
except ImportError:
    print("⚠️  cairosvg não encontrado.")
    print("   Alternativa: converta manualmente o favicon.svg em pwa-192x192.png e pwa-512x512.png")
    print("   Ferramenta online gratuita: https://cloudconvert.com/svg-to-png")
