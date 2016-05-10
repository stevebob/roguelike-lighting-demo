(ns js.generate
  (:require [clojure.string :as str]))

(declare convert)

(defn convert-list [l]
  (str "[" (str/join ", " (map convert l)) "]"))

(defn convert-string [s]
  (str "'" s "'"))

(defn convert-keyword [k]
  (str "'" (name k) "'"))

(defn convert-map [m]
  (let [convert-key #(if (keyword? %) (name %) %)
        convert-kvp (fn [[k v]] (str (convert-key k) ": " (convert v)))]
       (str "{" (str/join ", " (map convert-kvp m)) "}")))

(defn convert-set [s]
  (str "new Set([" (str/join ", " (map convert s)) "])"))

(defn convert [x]
  (cond (map? x)      (convert-map x)
        (set? x)      (convert-set x)
        (seq? x)      (convert-list x)
        (string? x)   (convert-string x)
        (keyword? x)  (convert-keyword x)
        (nil? x)      "null"
        :else x))

(defn arg-list [args]
  (str/join ", " (map name args)))

(defn block-comment [text] (str "/* " text " */"))
