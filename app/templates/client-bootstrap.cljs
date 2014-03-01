(ns <%= _.slugify(appname) %>.client.bootstrap
  (:require [<%= _.slugify(appname) %>.client.core :refer [insert-root-component! load-features!]]))

(enable-console-print!)

(insert-root-component! (.getElementById js/document "features"))
(load-features!)
