# SCR — Loading screen

Page statique sans installation, dépendance, API GitHub ou service musical externe.
Les images et les musiques ne sont pas fournies : ajoutez vos fichiers avant utilisation.
Sans image disponible, le fond reste noir. Sans MP3 disponible, le lecteur reste silencieux.

## Installation

1. Décompressez l'archive. Placez index.html, style.css, config.js, script.js ainsi que les dossiers images et music à la racine de votre dépôt GitHub (pas dans un sous-dossier supplémentaire).
2. Ajoutez images/imgupdate.png, puis images/img1.png, images/img2.png, images/img3.png, etc.
3. Ajoutez music/song1.mp3, music/song2.mp3, music/song3.mp3, etc.
4. Dans config.js, indiquez le nombre d'images ordinaires avec imageCount et le nombre de morceaux avec songCount. Ne comptez pas imgupdate.png dans imageCount. Par défaut, les deux nombres valent 3.
5. Dans les paramètres du dépôt : Settings > Pages > Build and deployment > Source : Deploy from a branch. Choisissez votre branche (souvent main) et le dossier /(root), puis Save. Si Pages est déjà configuré, conservez sa branche et son dossier de publication et placez les fichiers à cet endroit.
6. Utilisez l'adresse HTTPS du site publiée par GitHub Pages dans le server.cfg de votre serveur :

```cfg
sv_loadingurl "https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/"
```

Remplacez les valeurs par votre adresse réelle. Utilisez l'adresse Pages, pas celle du dépôt github.com ni un lien raw.

Documentation :
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://wiki.facepunch.com/gmod/Loading_URL

## Fonctionnement

- imgupdate.png est affichée en premier pendant 30 secondes à partir de son chargement réussi. Elle ne revient jamais pendant cette session. À la fin des 30 secondes, elle disparaît même si l'image suivante n'est pas encore prête.
- Les images ordinaires s'affichent ensuite pendant 10 secondes chacune, avec un fondu de 700 ms. La prochaine image est préchargée. Un réseau lent peut prolonger l'affichage de l'image ordinaire actuelle.
- Le tirage aléatoire exclut toujours le fichier précédent. Une image peut donc revenir après une autre image ; ce n'est pas une permutation complète de la collection.
- Une mise à jour introuvable est ignorée. Les images manquantes, invalides ou dont le chargement dépasse 15 secondes sont exclues pour la session.
- Avec une seule image ordinaire valide, celle-ci reste affichée. Avec zéro image ordinaire valide, le fond devient noir après la mise à jour.
- La première musique et chaque morceau suivant sont tirés au hasard. Le changement a lieu à la fin du morceau. Le précédent est exclu.
- Si un seul morceau fonctionne, il est joué une fois puis le lecteur s'arrête pour respecter l'absence de répétition immédiate. Les MP3 en erreur sont exclus pour la session.
- Chaque ouverture repart avec le son coupé. Le bouton active le son à 30 %, le curseur règle de 0 à 100 %. Le bouton permet ensuite de couper/rétablir le dernier volume choisi pendant cette session.
- Aucun volume n'est sauvegardé entre deux connexions.
- Si le navigateur bloque la lecture automatique, une action sur le volume tente de démarrer la musique. Le diaporama fonctionne indépendamment de l'audio.

## Ajouter des médias

Exemple avec 8 images ordinaires et 5 morceaux :

```js
imageCount: 8,
songCount: 5,
```

Les noms sont sensibles à la casse : img1.png et song1.mp3 en minuscules. Évitez les trous dans la numérotation. Il n'y a pas de découverte automatique du contenu du dépôt : mettez les nombres à jour dans config.js.
Pour changer l'annonce, remplacez simplement images/imgupdate.png et publiez le changement.

Les images sont affichées en entier sans déformation (imageFit: "contain"), avec des bandes noires si le format diffère de l'écran. Pour remplir toute la surface en recadrant les bords, utilisez imageFit: "cover". Des images 2560 × 1440 conviennent à un écran 16:9.
Les durées et la transition sont aussi modifiables dans config.js, en millisecondes.

## Vérifications effectuées et test en jeu

La syntaxe JavaScript et la logique ont été vérifiées avec une simulation des images, de l'audio et des temporisateurs : durées, exclusion de l'annonce, absence de répétition, volume, fichiers manquants et épuisement des morceaux.
Aucun test visuel dans un navigateur ou test dans Garry's Mod n'a été effectué. Les vrais médias ne sont pas encore présents.
Après publication, ouvrez le site dans un navigateur, puis connectez-vous au serveur pour vérifier le décodage des MP3 et l'interaction avec le contrôle de volume dans votre client Garry's Mod. Si le client ne transmet pas les clics au site pendant le chargement, le volume ne pourra pas être activé par ce bouton et restera muet.
