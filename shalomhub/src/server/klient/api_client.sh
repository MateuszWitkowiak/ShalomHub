#!/bin/bash

API_BASE_URL="http://localhost:3001/api"

function main_menu {
  echo "Wybierz API do testowania:"
  echo "1) Chat"
  echo "2) Eventy"
  echo "3) Posty"
  echo "4) Profil"
  read -p "Wybór: " api_choice

  case $api_choice in
    1) chat_menu ;;
    2) event_menu ;;
    3) post_menu ;;
    4) profile_menu ;;
    *) echo "Nieprawidłowy wybór!"; exit 1 ;;
  esac
}

function chat_menu {
  echo "Opcje API Chat:"
  echo "1) Pobierz wiadomości dla pokoju"
  read -p "Wybór: " chat_choice

  case $chat_choice in
    1)
      read -p "Podaj ID pokoju: " roomId
      response=$(curl -s -X GET "$API_BASE_URL/chat/messages/$roomId")
      echo "Odpowiedź API: $response"
      ;;
    *)
      echo "Nieprawidłowy wybór!"
      ;;
  esac
}

function event_menu {
  echo "Opcje API Eventy:"
  echo "1) Utwórz wydarzenie"
  echo "2) Pobierz wydarzenia"
  echo "3) Zapisz się na wydarzenie"
  echo "4) Usuń wydarzenie"
  read -p "Wybór: " event_choice

  case $event_choice in
    1)
      read -p "Podaj tytuł wydarzenia: " title
      read -p "Podaj opis wydarzenia: " description
      read -p "Podaj datę wydarzenia (YYYY-MM-DD): " date
      read -p "Podaj lokalizację: " location
      read -p "Podaj ID twórcy: " createdBy
      response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"title\": \"$title\", \"description\": \"$description\", \"date\": \"$date\", \"location\": \"$location\", \"createdBy\": \"$createdBy\"}" \
        "$API_BASE_URL/events")
      echo "Odpowiedź API: $response"
      ;;
    2)
      response=$(curl -s -X GET "$API_BASE_URL/events")
      echo "Odpowiedź API: $response"
      ;;
    3)
      read -p "Podaj ID wydarzenia: " eventId
      read -p "Podaj ID użytkownika: " userId
      response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"userId\": \"$userId\"}" \
        "$API_BASE_URL/events/$eventId/attend")
      echo "Odpowiedź API: $response"
      ;;
    4)
      read -p "Podaj ID wydarzenia do usunięcia: " eventId
      response=$(curl -s -X DELETE "$API_BASE_URL/events/$eventId/delete")
      echo "Odpowiedź API: $response"
      ;;
    *)
      echo "Nieprawidłowy wybór!"
      ;;
  esac
}

function post_menu {
  echo "Opcje API Posty:"
  echo "1) Dodaj post"
  echo "2) Pobierz wszystkie posty"
  echo "3) Polub/odpolub post"
  echo "4) Skomentuj post"
  echo "5) Edytuj post"
  echo "6) Usuń post"
  read -p "Wybór: " post_choice

  case $post_choice in
    1)
      read -p "Podaj opis posta: " description
      read -p "Podaj email użytkownika: " email
      response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"description\": \"$description\", \"email\": \"$email\"}" \
        "$API_BASE_URL/posts/add")
      echo "Odpowiedź API: $response"
      ;;
    2)
      response=$(curl -s -X GET "$API_BASE_URL/posts/getAll")
      echo "Odpowiedź API: $response"
      ;;
    3)
      read -p "Podaj ID posta: " postId
      read -p "Podaj email użytkownika: " userEmail
      response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"userEmail\": \"$userEmail\"}" \
        "$API_BASE_URL/posts/like/$postId")
      echo "Odpowiedź API: $response"
      ;;
    4)
      read -p "Podaj ID posta: " postId
      read -p "Podaj tekst komentarza: " text
      read -p "Podaj ID użytkownika: " userId
      response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"text\": \"$text\", \"userId\": \"$userId\"}" \
        "$API_BASE_URL/posts/comment/$postId")
      echo "Odpowiedź API: $response"
      ;;
    5)
      read -p "Podaj ID posta: " postId
      read -p "Podaj nowy opis: " description
      read -p "Podaj email użytkownika: " userEmail
      response=$(curl -s -X PUT -H "Content-Type: application/json" \
        -d "{\"description\": \"$description\", \"userEmail\": \"$userEmail\"}" \
        "$API_BASE_URL/posts/edit/$postId")
      echo "Odpowiedź API: $response"
      ;;
    6)
      read -p "Podaj ID posta do usunięcia: " postId
      read -p "Podaj email użytkownika: " userEmail
      response=$(curl -s -X DELETE -H "Content-Type: application/json" \
        -d "{\"userEmail\": \"$userEmail\"}" \
        "$API_BASE_URL/posts/delete/$postId")
      echo "Odpowiedź API: $response"
      ;;
    *)
      echo "Nieprawidłowy wybór!"
      ;;
  esac
}

function profile_menu {
  echo "Opcje API Profil:"
  echo "1) Pobierz profil użytkownika"
  echo "2) Edytuj profil użytkownika"
  echo "3) Wyszukaj użytkowników"
  echo "4) Wyślij zaproszenie do znajomych"
  echo "5) Odbierz zaproszenie"
  echo "6) Odrzuć zaproszenie"
  echo "7) Usuń znajomego"
  read -p "Wybór: " profile_choice

  case $profile_choice in
    1)
      read -p "Podaj email użytkownika: " email
      response=$(curl -s -X GET "$API_BASE_URL/profile?email=$email")
      echo "Odpowiedź API: $response"
      ;;
    2)
      read -p "Podaj email: " email
      read -p "Podaj imię: " firstName
      read -p "Podaj nazwisko: " lastName
      read -p "Podaj opis: " description
      response=$(curl -s -X PUT -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"firstName\": \"$firstName\", \"lastName\": \"$lastName\", \"description\": \"$description\"}" \
        "$API_BASE_URL/profile")
      echo "Odpowiedź API: $response"
      ;;
    *)
      echo "Nieprawidłowy wybór!"
      ;;
  esac
}

main_menu
