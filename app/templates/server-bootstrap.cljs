(ns <%= _.slugify(appname) %>.server.bootstrap
  (:require [<%= _.slugify(appname) %>.server.core :refer [start-server!]]))

;; This file bootstraps the server. We put it in a separate directory since
;; we don't want to include it in our tests as it will stomp on the main
;; function.

;; Fixes exception strack traces with source maps
(-> "source-map-support" js/require .install)

(defn ^:export main []
  (start-server! {}))

(set! *main-cli-fn* main)
