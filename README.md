Galleria
---

Welcome to Galleria, where you can share images, videos and articles with others. Application built with NodeJs and MongoDB.

### Features

As a galleria user you can:
- View all of the gallerties added by all users. A gallerite can be an image, article of YouTube video.
- Like exisiting gallerites.
- Add/remove your own gallerites.

### Homepage

The homepage shows the menu bar, search section and gallerites section.
From the homepage you can:
- Login/logout.
- Search gallerites.
- Go to the Add gallerite page (Authenticated users).
- Like/Unlike available gallerites.
- Explore a gallerite.
- Go to a user's page.

### Authentication

Authentication is done via Twitter-login. If you don't have a Twitter account... Go get one :)

### Adding a gallerite.

To add a gallerite you must be logged in. Click "Add gallerite" button available in any page to go the Add gallerite page.

In the page you have first to select the type of the gallerite you want to add: Image, Youtube or Article.

You will be asked to fill in three fields: link, descripton and tag (or tags seperated by commas). All fields are required. 

If the link provided is not valid, the gallerite will not be added and you will be notified. If the image link is valid but is not for an image, a placeholder image will be displayed instead. For YouTube links, provide the video's page's link.

When the gallerite is added successfully, you will be redirected to the homepage.

### Search

To search for a gallerite, Enter a tag in the search bar and click search. You will be redirected to the search results page.

The results will have two sections, full matches and partial matches.

In a gallerite's page, clicking a tag will perform a search for that tag.

### My gallerites (Authenticated users)

You can go to this page by clicking "My gallerites" button.

This page shows all the gallerites you added. In another section, it will also show the gallerties you liked which were added by other users.

### Gallerite's page

You can go to this page by clicking "Explore" button associated with each gallerite.

The top section shows main information about the gallerite. The below section shows the user who liked the gallerite. 

If the gallerite is an image gallerite, you can click on the image to view a zoomed-in version.

Click on any of the gallerites tags to perform a search for that tag.

If You added the gallerite, a "Delete" button will be available.

### User's page

You can go to this page by clicking on the user's name or image (found under "Added by").

In this page you can find main information about the user including the number of added gallerites. The second section shows the gallerites added by the user, and the last section shows the gallerites liked by the user which were added by other users.

`Copyright © Galleria 2016. All Rights Reserved`