# Attalos

A modern platform for online discussion built on GNU principles

# Separation of services

This application is split into 2 main categories:

* ## front-end
   
  The front-end of attalos is a static single page application built primarily with the react platform. The main component diagram is as follows:
   
      <IndexComponent>
        <AttalosComponent />
      </IndexComponent>

  ### Theory of Routing

     You can use queryString params with static files...

      /rooms/123 => ?id=123&controller=rooms&action=index

     If sufficient server resources exist, mapping from URL pathInfo => queryString is trivial

     Thus, state should be managed soley by the values in queryString (and enhanced via more direct url aliases)

     Page navigation occurs when the state of the queryString changes, BUT queryString URLs are views of the state itself

     State should be fetched via the history api

     https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history

* ## back-end
   
   The back-end of the attalos is several servers each with a specific duty

    * CHAT
    
      Primary Messaging Bus, based on `XMPP`, allowing for both `c2s` and `s2s` operation 

    * WEB
    
	  Serves resources under the `public/*` directory over HTTP with `express`
	  
    * BOSH
    
      Legacy networking adapter for enhanced client compatibility


# Where to start

This project uses `make` to coordinate all aspects of its development, the primary targets of interest are:

 * clean
 * all
 * check
 * dist

Source of both client and server logic is only in this repo

* src/javascripts
* src/stylesheets

# Build it yourself

    bundle
    DEFAULT_XMPP_PORT=5100 foreman start

1. TODO: vagrant dev box
1. TODO: docker image (think federations based on domain over a cluster of servers)
