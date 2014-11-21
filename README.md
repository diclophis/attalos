# Attalos

A modern platform for online discussion built on GNU principles

# Separation of services

This application is split into 2 main categories:

1. front-end
   
   The front-end of attalos is a static single page application built primarily with the react platform. The main component diagram is as follows:
   
       <IndexComponent>
         <AttalosComponent />
       </IndexComponent>

1. back-end
   
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

1. TODO: vagrant dev box
1. TODO: docker image (think federations based on domain over a cluster of servers)
