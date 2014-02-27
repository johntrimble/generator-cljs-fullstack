(ns <%= _.slugify(appname) %>.client.bootstrap
  (:require [<%= _.slugify(appname) %>.client.core :refer [feature-list-view load-features! app-state]]
            [om.core :as om :include-macros true]))

(enable-console-print!)

(om/root feature-list-view
         app-state
         {:target (.getElementById js/document "features")})
(load-features!)
