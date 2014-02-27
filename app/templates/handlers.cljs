(ns <%= _.slugify(appname) %>.server.handlers
  (:require [<%= _.slugify(appname) %>.util :as util]))


(defn hello-handler [req res]
  (let [body "Hello World"
        body-len (.byteLength js/Buffer body)]
    (doto res
      (.setHeader "Content-Type" "text/plain")
      (.setHeader "Content-Length" body-len)
      (.end body))))

(def features
  [{:title "Node.js"
    :description "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications."}
   {:title "ClojureScript"
    :description "ClojureScript is a new compiler for Clojure that targets JavaScript."}
   {:title "Sass with Compass"
    :description "Compass is an open-source CSS Authoring Framework that uses Sass."}
   {:title "Bootstrap"
    :description "Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development."},
   {:title "Evan's Source Map Support"
    :description "This module provides source map support for stack traces in node via the V8 stack trace API."}
   {:title "Om"
    :description "A ClojureScript interface to Facebook's React."}
   {:title "PhantomJS"
    :description "PhantomJS is a headless WebKit scriptable with a JavaScript API."}])

(defn features-handler [req res]
  (doto res
    (.setHeader "Content-Type" "application/json")
    (.end (util/->json features))))
