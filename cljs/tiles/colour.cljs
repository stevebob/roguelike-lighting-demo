(ns tiles.colour)

(defn rgba [r g b a] (str "rgba(" r "," g "," b "," a ")"))
(defn rgb [r g b] (str "rgb(" r "," g "," b ")"))

(def black (rgb 0 0 0))
(def white (rgb 0xff 0xff 0xff))
(def transparent (rgba 0 0 0 0))
