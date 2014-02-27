(ns <%= _.slugify(appname) %>.util)

(defn ->json [obj]
  (js/JSON.stringify (clj->js obj)))
