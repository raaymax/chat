use std::collections::HashMap;

use reqwest::StatusCode;
use tauri::{http, utils::mime_type, window::Color, Url};
use tauri_plugin_log::{Target, TargetKind};
use http::{header::CONTENT_TYPE, Request, Response as HttpResponse};

#[cfg(debug_assertions)]
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
                //window.set_background_color(Some(Color::from("#000000")));
            }
            Ok(())
        })
        .register_asynchronous_uri_scheme_protocol("proxy".to_string(), |_ctx, request, responder| {
            let url = "https://chat.codecat.io".to_string();
          let path = request.uri().to_string()
            .strip_prefix("tauri://localhost")
            .map(|p| p.to_string())
            .unwrap_or_else(|| "".to_string());


            let url = format!(
              "{}/{}",
              url.trim_end_matches('/'),
              path.trim_start_matches('/')
            );
              let mut response = {
                let url = format!(
                  "{}/{}",
                  url.trim_end_matches('/'),
                  ""
                );
              let mut builder = HttpResponse::builder();

                let mut proxy_builder = reqwest::ClientBuilder::new()
                  .build()
                  .unwrap()
                  .request(request.method().clone(), &url);
                for (name, value) in request.headers() {
                  proxy_builder = proxy_builder.header(name, value);
                }
                match tauri::async_runtime::block_on(proxy_builder.send()) {
                  Ok(r) => {
                    for (name, value) in r.headers(){
                      builder = builder.header(name, value);
                    }
                    let status = r.status();
                    let body = tauri::async_runtime::block_on(r.bytes()).unwrap();
                    builder
                      .status(status)
                      .body(body.to_vec())
                      .unwrap()
                  }
                  Err(e) => {
                    //log::error!("Failed to request {}: {}", url.as_str(), e);
                    //return Err(Box::new(e));
                    builder
                      .status(500)
                      .body(format!("Internal Server Error {:?}", e).as_bytes().to_vec())
                      .unwrap()
                  }
                }
              };
            responder.respond(response);
        })
        .invoke_handler(tauri::generate_handler![greet, test])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn test() -> String {
    println!("test");
    let res = reqwest::get("https://chat.codecat.io/api/ping").await;
    if res.is_err() {
        let err = res.err().unwrap();
        return format!("{:?}", err).to_string();
    }
    let data = res.unwrap().text().await;
    if data.is_err() {
        return "error data".to_string();
    }
    data.unwrap()
}
