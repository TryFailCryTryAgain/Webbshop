# Projektuppgift i JavaScript

I denna uppgift ska du arbeta med ett eget projekt byggt helt i JavaScript.	
Idén för projektet väljer du själv. Om du saknar en egen idéfinns en lista med förslag längre
ned.

Målet är att visa att du självständigt kan ta dina kunskaper och gåfrån idé- och konceptfas
till en färdig applikation.	

Projektet ska använda ett RESTful API i Node.js med JWT-baserad autentisering och
MongoDB som dokumentdatabas.	

## Viktigt!

Om du väljer att inte göra en traditionell webbapplikation (t.ex. en inbäddad applikation)
måste du omedelbart diskutera omfattningen med din lärare. I sådana fall kan testkraven för
applikationen skilja sig.	

# Kravspecifikation

## Icke-funktionella krav
- Backend ska tillahndhålla ett RESTful API som kan användas med valfri frontend.
- Applikationen ska fungera i alla moderna webbläsare.
- Applikationen ska vara responsiv och fungera på alla skärmstorlekar.

## Funktionella krav
- En användare måste kunna registrera ett konto.
- En användare måste kunna logga in.
- En användare måste kunna söka i applikationen.
- En administratör måste kunna looga in på en enkel dashboard och skapa/uppdatera/radera användare.

- Administratör bör kunna tilldela behörigheter baserat på roller
- Administratör bör kunna skapa/läsa&uppdatera/radera roller
- Administratör bör kunna skicka e-post från dashboarden

# Design Krav
Projektet ska byggas på en tydlig designprocess och inkludera:
- Användarstudie (minst 5 svar), Se Webbriktlinjer.
- Personas (minst 1 baserad på studien)
- User stories kopplade till personas
- Sitemap och lo-fi wireframes/prototyper



# Tekniska krav
- Applikationen ska deployas hos en leverantör som stödjer Node.js (tänk påCORS och
HTTPS).	
- Backend ska implementeras i Node.js med Express eller Fastify (annat val kräver
godkännande).	
- Databasen ska vara MongoDB.	
- Frontend bör byggas i React eller Angular.	
- Projektet bör göras tillgängligt offline (PWA).	
- API-dokumentation bör finnas (t.ex. via Insomnia).	
  
- Testdriven utveckling (TDD)

# Arbetsprocess
- Projektet måste versionshanteras i Git. Inlämningar med endast en commit kommer inte
godkännas.	
- Följ GitHub Flow som arbetsmetodik.	
- Koden ska följa kodstandarder:	
- - Airbnb JavaScript Style Guide, https://airbnb.io/projects/javascript/	
- - Airbnb CSS Style Guide, https://github.com/airbnb/css	
- Använd en konfigurationsguide, t.ex. ESLint + Airbnb Style + Pret

# Inlämning
- Projektet lämnas in som en länk till GitHub-repot: GitHub Classroom-länk	
- Läraren måste ha åtkomst till repot.	

## Förslag på arbetsplan
1. Iteration 1: UX/design och användaranalys.	
2. Iteration 2: Bygg vyer och komponenter (frontend), koppla mot enkel mock-backend.	
3. Iteration 3: Implementera backend i Node (databasstruktur + autentisering). Testa routes
i Insomnia.	
4. Iteration 4: Koppla frontend mot backend. Börja testa deploy.	
5. Iteration 5: Testa noggrant (i olika webbläsare). Deploya skarpt.	
6. Iteration 6: Fixa buggar och/eller lägg till extra funktionalitet för högre betyg.	

Tips: det går ocksåbra att börja med backend och ta frontend senare.	