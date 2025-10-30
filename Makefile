.PHONY: help install dev serve build preview clean post til quote

help:
	@echo "Comandos disponibles:"
	@echo "  make install  - Instalar dependencias"
	@echo "  make dev      - Iniciar servidor de desarrollo"
	@echo "  make serve    - Alias para dev"
	@echo "  make build    - Construir para producción"
	@echo "  make preview  - Previsualizar build de producción"
	@echo "  make clean    - Limpiar archivos generados"
	@echo "  make post     - Crear nuevo post"
	@echo "  make til      - Crear nuevo TIL"
	@echo "  make quote    - Crear nueva quote"

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

post:
	@read -p "Nombre del post: " name; \
	slug=$$(echo $$name | tr '[:upper:]' '[:lower:]' | tr ' ' '-'); \
	file="src/pages/posts/$$slug.mdx"; \
	date=$$(date +%Y-%m-%d); \
	echo "---" > $$file; \
	echo "title: $$name" >> $$file; \
	echo "date: $$date" >> $$file; \
	echo "tag: " >> $$file; \
	echo "category: " >> $$file; \
	echo "---" >> $$file; \
	echo "" >> $$file; \
	echo "# $$name" >> $$file; \
	echo "" >> $$file; \
	nvim $$file

til:
	@read -p "Nombre del TIL: " name; \
	slug=$$(echo $$name | tr '[:upper:]' '[:lower:]' | tr ' ' '-'); \
	file="src/pages/til/$$slug.md"; \
	date=$$(date +%Y-%m-%d); \
	echo "---" > $$file; \
	echo "date: $$date" >> $$file; \
	echo "---" >> $$file; \
	echo "" >> $$file; \
	nvim $$file

quote:
	@file="src/pages/quotes/new-quote.md"; \
	date=$$(date +%Y-%m-%d); \
	echo "---" > $$file; \
	echo "date: $$date" >> $$file; \
	echo "author: " >> $$file; \
	echo "source: " >> $$file; \
	echo "---" >> $$file; \
	echo "" >> $$file; \
	nvim $$file
