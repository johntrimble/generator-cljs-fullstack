(ns <%= _.slugify(appname) %>.server.core
  (:require [<%= _.slugify(appname) %>.server.handlers :as handlers]))

(defn start-server! [config & args]
  (let [express (js/require "express")
        app (express)]

    ;; Note: strange use of (aget express "static") is to work around an issue
    ;; where the Closure compiles logs a warning due to use of "static" which
    ;; is a reserved word in older JS versions.
    (doto app
      (.use ((aget express "static") (str js/__dirname "/public")))
      (.get "/api/features" handlers/features-handler)
      (.get "/api/hello" handlers/hello-handler)
      (.get "/api/error" (fn [req res] (throw (js/Error "Bad happened")))))

    (.listen app 4000)
    (.log js/console "Site available at http://localhost:4000")))
