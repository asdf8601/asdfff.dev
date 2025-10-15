.PHONY: help install dev serve build preview clean

help:
	@echo "Comandos disponibles:"
	@echo "  make install  - Instalar dependencias"
	@echo "  make dev      - Iniciar servidor de desarrollo"
	@echo "  make serve    - Alias para dev"
	@echo "  make build    - Construir para producción"
	@echo "  make preview  - Previsualizar build de producción"
	@echo "  make clean    - Limpiar archivos generados"

install:
	bun install

dev:
	bun run dev

serve: dev

build:
	bun run build

preview:
	bun run preview

clean:
	rm -rf dist node_modules .astro
